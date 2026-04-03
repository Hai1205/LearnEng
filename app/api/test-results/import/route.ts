import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

const REQUIRED_COLUMNS = ["category", "title", "part1", "part2", "part3", "part4", "part5", "part6", "part7"];
const OPTIONAL_COLUMNS = ["score"];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Only Excel files (.xlsx, .xls) are allowed" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            return NextResponse.json({ error: "Excel file has no sheets" }, { status: 400 });
        }

        const sheet = workbook.Sheets[sheetName];
        const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
            return NextResponse.json({ error: "Excel file has no data rows" }, { status: 400 });
        }

        // Validate columns
        const headers = Object.keys(rows[0]);
        const missingCols = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
        if (missingCols.length > 0) {
            return NextResponse.json({ error: `Missing required columns: ${missingCols.join(", ")}. Required: ${REQUIRED_COLUMNS.join(", ")}. Optional: ${OPTIONAL_COLUMNS.join(", ")}` }, { status: 400 });
        }

        // Parse and validate rows
        const errors: string[] = [];
        const validDocs: any[] = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 2; // header at row 1

            const category = String(row.category ?? "").trim();
            const title = String(row.title ?? "").trim();
            const partsRaw = {
                part1: row.part1,
                part2: row.part2,
                part3: row.part3,
                part4: row.part4,
                part5: row.part5,
                part6: row.part6,
                part7: row.part7,
            };

            const parts = {
                part1: Number(partsRaw.part1 ?? NaN),
                part2: Number(partsRaw.part2 ?? NaN),
                part3: Number(partsRaw.part3 ?? NaN),
                part4: Number(partsRaw.part4 ?? NaN),
                part5: Number(partsRaw.part5 ?? NaN),
                part6: Number(partsRaw.part6 ?? NaN),
                part7: Number(partsRaw.part7 ?? NaN),
            };

            const invalidPart = Object.keys(parts).find((k) => !Number.isFinite((parts as any)[k]));
            if (!category || !title || invalidPart) {
                errors.push(`Row ${rowNum}: invalid or missing fields (category, title, part1..part7)`);
                continue;
            }

            const score = parts.part1 + parts.part2 + parts.part3 + parts.part4 + parts.part5 + parts.part6 + parts.part7;

            validDocs.push({
                category,
                title,
                ...parts,
                score,
                createdAt: new Date(),
            });
        }

        if (validDocs.length === 0) {
            return NextResponse.json({ error: "No valid rows found", details: errors }, { status: 400 });
        }

        const db = await getDb();
        const result = await db.collection("test_results").insertMany(validDocs);

        const imported = validDocs.map((doc, idx) => ({
            id: result.insertedIds[idx].toString(),
            category: doc.category,
            title: doc.title,
            part1: doc.part1,
            part2: doc.part2,
            part3: doc.part3,
            part4: doc.part4,
            part5: doc.part5,
            part6: doc.part6,
            part7: doc.part7,
            score: doc.score,
        }));

        return NextResponse.json({ data: { imported, importedCount: imported.length, errors: errors.length ? errors : undefined } }, { status: 201 });
    } catch (error) {
        console.error("POST /api/test-results/import error:", error);
        return NextResponse.json({ error: "Failed to import test results" }, { status: 500 });
    }
}
