import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

const REQUIRED_COLUMNS = ["category", "question", "errorType", "reason", "answer", "note"];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        // Support multiple files with the same field name 'file' (e.g., <input multiple />)
        const files = formData.getAll("file") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];

        const allCards: IFixProblem[] = [];
        let totalImported = 0;
        const allErrors: string[] = [];

        const db = await getDb();

        for (let f = 0; f < files.length; f++) {
            const file = files[f];
            const fileName = file.name || `file_${f}`;

            try {
                if (!allowedTypes.includes(file.type)) {
                    allErrors.push(`File ${fileName}: Only Excel files (.xlsx, .xls) are allowed`);
                    continue;
                }

                const buffer = Buffer.from(await file.arrayBuffer());
                const workbook = XLSX.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];

                if (!sheetName) {
                    allErrors.push(`File ${fileName}: Excel file has no sheets`);
                    continue;
                }

                const sheet = workbook.Sheets[sheetName];
                const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                if (rows.length === 0) {
                    allErrors.push(`File ${fileName}: Excel file has no data rows`);
                    continue;
                }

                // Validate columns based on first row keys
                const headers = Object.keys(rows[0]).map((h) => String(h).toLowerCase().trim());
                const expectedHeaders = [...REQUIRED_COLUMNS].map((h) => h.toLowerCase().trim());

                // Check for missing required columns
                const missingCols = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
                if (missingCols.length > 0) {
                    allErrors.push(
                        `File ${fileName}: Missing required columns: ${missingCols.join(", ")}. Required: ${REQUIRED_COLUMNS.join(", ")}}`
                    );
                    // still continue to next file
                    continue;
                }

                // Strict check: unexpected columns (not in expected set) will mark the whole file invalid
                const unexpected = headers.filter((h) => !expectedHeaders.includes(h));
                if (unexpected.length > 0) {
                    allErrors.push(
                        `File ${fileName}: Unexpected/invalid columns: ${unexpected.join(", ")}. Expected headers (order-insensitive): ${expectedHeaders.join(", ")}`
                    );
                    continue;
                }

                // Parse and validate rows for this file
                const fileErrors: string[] = [];
                const validDocs: any[] = [];

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const rowNum = i + 2; // header

                    const category = String(row.category ?? "").trim();
                    const question = String(row.question ?? "").trim();
                    const errorType = String(row.errorType ?? "").trim();
                    const reason = String(row.reason ?? "").trim();
                    const answer = String(row.question ?? "").trim();
                    const note = String(row.question ?? "").trim();

                    if (!category || !reason || !question) {
                        fileErrors.push(
                            `File ${fileName} - Row ${rowNum}: (category: ${category} - reason: ${reason} - question: ${question}) missing required fields`
                        );
                        continue;
                    }

                    const options: string[] = [];
                    for (let j = 1; j <= 4; j++) {
                        const optVal = String(row[`option${j}`] ?? "").trim();
                        if (optVal) options.push(optVal);
                    }

                    if (options.length === 0) {
                        fileErrors.push(
                            `File ${fileName} - Row ${rowNum}: (category: ${category} - reason: ${reason} - question: ${question}) at least one option (answer) is required`
                        );
                        continue;
                    }

                    validDocs.push({
                        category,
                        question,
                        errorType,
                        reason,
                        answer,
                        note,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                }

                // Insert valid docs for this file if any
                if (validDocs.length > 0) {
                    const result = await db.collection("fix-problem").insertMany(validDocs);

                    const insertedCount = Object.keys(result.insertedIds).length;
                    totalImported += insertedCount;

                    const cards = validDocs.map((doc, idx) => ({
                        id: result.insertedIds[idx].toString(),
                        category: doc.category,
                        question: doc.question,
                        errorType: doc.errorType,
                        reason: doc.reason,
                        answer: doc.answer,
                        note: doc.note,
                    }));

                    allCards.push(...cards);
                }

                // Append file-specific errors to global list
                if (fileErrors.length > 0) {
                    allErrors.push(...fileErrors);
                }
            } catch (fileErr) {
                console.error(`Error processing file ${fileName}:`, fileErr);
                allErrors.push(`File ${fileName}: Failed to process (${String(fileErr)})`);
                // continue with next file
            }
        }

        return NextResponse.json(
            {
                data: {
                    cards: allCards,
                    imported: totalImported,
                    errors: allErrors.length > 0 ? allErrors : undefined,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/fix-problems/import error:", error);
        return NextResponse.json(
            { error: "Failed to import fix problem" },
            { status: 500 }
        );
    }
}
