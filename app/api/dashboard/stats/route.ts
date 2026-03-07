import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const db = await getDb();

        const [totalQuestions, totalWord, quizzResults, vocabProgress] =
            await Promise.all([
                db.collection("quizzes").countDocuments(),
                db.collection("flashcards").countDocuments(),
                db
                    .collection("quizz_results")
                    .aggregate([
                        {
                            $group: {
                                _id: null,
                                correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
                                wrong: { $sum: { $cond: ["$isCorrect", 0, 1] } },
                            },
                        },
                    ])
                    .toArray(),
                db
                    .collection("Word_progress")
                    .aggregate([
                        {
                            $group: {
                                _id: null,
                                memorized: { $sum: { $cond: ["$isMemorized", 1, 0] } },
                                unmemorized: { $sum: { $cond: ["$isMemorized", 0, 1] } },
                            },
                        },
                    ])
                    .toArray(),
            ]);

        const resultStats = quizzResults[0] || { correct: 0, wrong: 0 };
        const vocabStats = vocabProgress[0] || { memorized: 0, unmemorized: 0 };

        const stats: IDashboardStats = {
            totalQuestions,
            correctAnswers: resultStats.correct,
            wrongAnswers: resultStats.wrong,
            totalWord,
            memorizedWord: vocabStats.memorized,
            unmemorizedWord: vocabStats.unmemorized,
        };

        return NextResponse.json({ data: { stats } });
    } catch (error) {
        console.error("GET /api/dashboard/stats error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard stats" },
            { status: 500 }
        );
    }
}
