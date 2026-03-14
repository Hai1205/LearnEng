import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

const REQUIRED_COLUMNS = ["topic", "word"];
const OPTIONAL_COLUMNS = ["meaning", "ipa", "example"];

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
            topic: string;
            word: string;
            meaning: string;
            ipa: string;
            example: string;
            createdAt: Date;
            updatedAt: Date;
        }[] = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 2; // +2 because row 1 is header, data starts at row 2

            const topic = String(row.topic ?? "").trim();
            const word = String(row.word ?? "").trim();

            if (!topic || !word) {
                errors.push(
                    `Row ${rowNum}: missing required fields (topic, word)`
                );
                continue;
            }

            validDocs.push({
                topic,
                word,
                meaning: String(row.meaning ?? "").trim(),
                ipa: String(row.ipa ?? "").trim(),
                example: String(row.example ?? "").trim(),
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
        const result = await db.collection("flashcards").insertMany(validDocs);

        const cards: IFlashCard[] = validDocs.map((doc, idx) => ({
            id: result.insertedIds[idx].toString(),
            topic: doc.topic,
            word: doc.word,
            meaning: doc.meaning,
            ipa: doc.ipa,
            example: doc.example,
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
        console.error("POST /api/flash-cards/import error:", error);
        return NextResponse.json(
            { error: "Failed to import flash cards" },
            { status: 500 }
        );
    }
}
