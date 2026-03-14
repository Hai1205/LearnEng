import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

const REQUIRED_COLUMNS = ["category", "topic", "question", "option1"];
const OPTIONAL_COLUMNS = ["level", "option2", "option3", "option4", "answer"];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Only Excel files (.xlsx, .xls) are allowed" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            return NextResponse.json(
                { error: "Excel file has no sheets" },
                { status: 400 }
            );
        }

        const sheet = workbook.Sheets[sheetName];
        const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Excel file has no data rows" },
                { status: 400 }
            );
        }

        // Validate columns
        const headers = Object.keys(rows[0]);
        const missingCols = REQUIRED_COLUMNS.filter(
            (col) => !headers.includes(col)
        );
        if (missingCols.length > 0) {
            return NextResponse.json(
                {
                    error: `Missing required columns: ${missingCols.join(", ")}. Required: ${REQUIRED_COLUMNS.join(", ")}. Optional: ${OPTIONAL_COLUMNS.join(", ")}`,
                },
                { status: 400 }
            );
        }

        // Parse and validate rows
        const errors: string[] = [];
        const validDocs: {
            category: string;
            topic: string;
            level: string;
            question: string;
            options: string[];
            answer: number;
            explaining: string;
            createdAt: Date;
            updatedAt: Date;
        }[] = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 2;

            const category = String(row.category ?? "").trim();
            const topic = String(row.topic ?? "").trim();
            const question = String(row.question ?? "").trim();

            if (!category || !topic || !question) {
                errors.push(
                    `Row ${rowNum}: missing required fields (category, topic, question)`
                );
                continue;
            }

            // Collect options from opt1, opt2, opt3, opt4
            const options: string[] = [];
            for (let j = 1; j <= 4; j++) {
                const optVal = String(row[`option${j}`] ?? "").trim();
                if (optVal) options.push(optVal);
            }

            if (options.length === 0) {
                errors.push(`Row ${rowNum}: at least one option (opt1) is required`);
                continue;
            }

            const ansRaw = Number(row.answer);
            const answer =
                !isNaN(ansRaw) && ansRaw >= 0 && ansRaw < options.length
                    ? ansRaw
                    : 0;
            
            const explaining = String(row.explaining ?? "").trim();

            validDocs.push({
                category,
                topic,
                level: String(row.level ?? "").trim(),
                question,
                options,
                answer,
                explaining,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        if (validDocs.length === 0) {
            return NextResponse.json(
                {
                    error: "No valid rows found",
                    details: errors,
                },
                { status: 400 }
            );
        }

        const db = await getDb();
        const result = await db.collection("quizzes").insertMany(validDocs);

        const cards: IQuizz[] = validDocs.map((doc, idx) => ({
            id: result.insertedIds[idx].toString(),
            category: doc.category,
            topic: doc.topic,
            level: doc.level,
            question: doc.question,
            options: doc.options,
            answer: doc.answer,
            explaining: doc.explaining,
        }));

        return NextResponse.json(
            {
                data: {
                    cards,
                    imported: cards.length,
                    errors: errors.length > 0 ? errors : undefined,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/quizzes/import error:", error);
        return NextResponse.json(
            { error: "Failed to import quizzes" },
            { status: 500 }
        );
    }
}
