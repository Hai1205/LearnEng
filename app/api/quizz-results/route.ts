import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const db = await getDb();
        const docs = await db
            .collection("quizz_results")
            .find({})
            .sort({ answeredAt: -1 })
            .limit(500)
            .toArray();

        const results: IQuizzResult[] = docs.map((doc) => ({
            id: doc._id.toString(),
            quizzId: doc.quizzId ?? "",
            selectedAnswer: doc.selectedAnswer ?? 0,
            isCorrect: doc.isCorrect ?? false,
            answeredAt: doc.answeredAt?.toISOString?.() ?? new Date().toISOString(),
        }));

        return NextResponse.json({ data: { results } });
    } catch (error) {
        console.error("GET /api/quizz-results error:", error);
        return NextResponse.json(
            { error: "Failed to fetch quiz results" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { quizzId, selectedAnswer, isCorrect } = body;

        if (!quizzId || selectedAnswer === undefined || isCorrect === undefined) {
            return NextResponse.json(
                { error: "quizzId, selectedAnswer, and isCorrect are required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const result = await db.collection("quizz_results").insertOne({
            quizzId,
            selectedAnswer,
            isCorrect: Boolean(isCorrect),
            answeredAt: new Date(),
        });

        return NextResponse.json(
            {
                data: {
                    result: {
                        id: result.insertedId.toString(),
                        quizzId,
                        selectedAnswer,
                        isCorrect: Boolean(isCorrect),
                        answeredAt: new Date().toISOString(),
                    },
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/quizz-results error:", error);
        return NextResponse.json(
            { error: "Failed to record quiz result" },
            { status: 500 }
        );
    }
}
