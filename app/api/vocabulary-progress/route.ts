import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const db = await getDb();
        const docs = await db.collection("vocabulary_progress").find({}).toArray();

        const progress: IVocabularyProgress[] = docs.map((doc) => ({
            id: doc._id.toString(),
            flashCardId: doc.flashCardId ?? "",
            isMemorized: doc.isMemorized ?? false,
            updatedAt: doc.updatedAt?.toISOString?.() ?? new Date().toISOString(),
        }));

        return NextResponse.json({ data: { progress } });
    } catch (error) {
        console.error("GET /api/vocabulary-progress error:", error);
        return NextResponse.json(
            { error: "Failed to fetch vocabulary progress" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { flashCardId, isMemorized } = body;

        if (!flashCardId || isMemorized === undefined) {
            return NextResponse.json(
                { error: "flashCardId and isMemorized are required" },
                { status: 400 }
            );
        }

        const db = await getDb();

        // Upsert: update if exists, insert if not
        const result = await db.collection("vocabulary_progress").findOneAndUpdate(
            { flashCardId },
            {
                $set: {
                    isMemorized: Boolean(isMemorized),
                    updatedAt: new Date(),
                },
                $setOnInsert: { flashCardId },
            },
            { upsert: true, returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json(
                { error: "Failed to update progress" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            data: {
                progress: {
                    id: result._id.toString(),
                    flashCardId: result.flashCardId,
                    isMemorized: result.isMemorized,
                    updatedAt: result.updatedAt?.toISOString?.() ?? new Date().toISOString(),
                },
            },
        });
    } catch (error) {
        console.error("POST /api/vocabulary-progress error:", error);
        return NextResponse.json(
            { error: "Failed to update vocabulary progress" },
            { status: 500 }
        );
    }
}
