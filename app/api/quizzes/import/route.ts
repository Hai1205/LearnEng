import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

const REQUIRED_COLUMNS = ["cat", "topic", "q", "opt1"];
const OPTIONAL_COLUMNS = ["lvl", "opt2", "opt3", "opt4", "ans"];

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
            cat: string;
            topic: string;
            lvl: string;
            q: string;
            opts: string[];
            ans: number;
            createdAt: Date;
            updatedAt: Date;
        }[] = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 2;

            const cat = String(row.cat ?? "").trim();
            const topic = String(row.topic ?? "").trim();
            const q = String(row.q ?? "").trim();

            if (!cat || !topic || !q) {
                errors.push(
                    `Row ${rowNum}: missing required fields (cat, topic, q)`
                );
                continue;
            }

            // Collect options from opt1, opt2, opt3, opt4
            const opts: string[] = [];
            for (let j = 1; j <= 4; j++) {
                const optVal = String(row[`opt${j}`] ?? "").trim();
                if (optVal) opts.push(optVal);
            }

            if (opts.length === 0) {
                errors.push(`Row ${rowNum}: at least one option (opt1) is required`);
                continue;
            }

            const ansRaw = Number(row.ans);
            const ans =
                !isNaN(ansRaw) && ansRaw >= 0 && ansRaw < opts.length
                    ? ansRaw
                    : 0;

            validDocs.push({
                cat,
                topic,
                lvl: String(row.lvl ?? "").trim(),
                q,
                opts,
                ans,
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
            cat: doc.cat,
            topic: doc.topic,
            lvl: doc.lvl,
            q: doc.q,
            opts: doc.opts,
            ans: doc.ans,
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
