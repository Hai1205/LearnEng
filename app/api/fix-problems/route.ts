import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const db = await getDb();
        const docs = await db.collection("fix-problems").find({}).toArray();
        const cards: IFixProblem[] = docs.map((doc) => ({
            id: doc._id.toString(),
            category: doc.category ?? "",
            question: doc.question ?? "",
            errorType: doc.errorType ?? "",
            reason: doc.reason ?? "",
            answer: doc.answer ?? 0,
            note: doc.note ?? "",
        }));
        return NextResponse.json({ data: { cards } });
    } catch (error) {
        console.error("GET /api/fix-problems error:", error);
        return NextResponse.json(
            { error: "Failed to fetch fix problems" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { category, reason, note, question, answer, errorType } = body;

        if (!category || !reason || !question) {
            return NextResponse.json(
                { error: "category, reason, question are required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const result = await db.collection("fix-problems").insertOne({
            category,
            question,
            errorType,
            reason,
            answer,
            note,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const card: IFixProblem = {
            id: result.insertedId.toString(),
            category,
            question,
            errorType,
            reason,
            answer,
            note,
        };

        return NextResponse.json({ data: { card } }, { status: 201 });
    } catch (error) {
        console.error("POST /api/fix-problems error:", error);
        return NextResponse.json(
            { error: "Failed to create quiz" },
            { status: 500 }
        );
    }
}
