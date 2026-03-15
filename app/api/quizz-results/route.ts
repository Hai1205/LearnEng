import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const pageParam = Number(searchParams.get("page") ?? "1");
        const sizeParam = Number(searchParams.get("size") ?? "10");
        const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
        const size = Number.isFinite(sizeParam) && sizeParam > 0
            ? Math.min(Math.floor(sizeParam), 100)
            : 10;
        const skip = (page - 1) * size;

        const db = await getDb();
        const resultsCollection = db.collection("quizz_results");

        const [docs, totalElements, totalCorrect] = await Promise.all([
            resultsCollection
                .find({})
                .sort({ answeredAt: -1 })
                .skip(skip)
                .limit(size)
                .toArray(),
            resultsCollection.countDocuments({}),
            resultsCollection.countDocuments({ isCorrect: true }),
        ]);

        const quizzIds = docs
            .map((doc) => String(doc.quizzId ?? ""))
            .filter((id) => ObjectId.isValid(id));

        const quizzObjectIds = [...new Set(quizzIds)].map((id) => new ObjectId(id));

        const quizzDocs = quizzObjectIds.length
            ? await db
                .collection("quizzes")
                .find({ _id: { $in: quizzObjectIds } })
                .project({ category: 1, topic: 1, level: 1, question: 1, options: 1, answer: 1, explaining: 1 })
                .toArray()
            : [];

        const quizzMap = new Map(
            quizzDocs.map((quizz) => [quizz._id.toString(), quizz])
        );

        const results: IQuizzHistoryItem[] = docs.map((doc) => {
            const quizzId = String(doc.quizzId ?? "");
            const quizz = quizzMap.get(quizzId);
            const options = Array.isArray(quizz?.options) ? quizz.options : [];
            const selectedAnswer = Number.isFinite(doc.selectedAnswer) ? Number(doc.selectedAnswer) : 0;
            const correctAnswer = Number.isFinite(quizz?.answer) ? Number(quizz?.answer) : 0;

            return {
                id: doc._id.toString(),
                quizzId,
                selectedAnswer,
                isCorrect: Boolean(doc.isCorrect),
                answeredAt: doc.answeredAt?.toISOString?.() ?? new Date().toISOString(),
                category: quizz?.category ?? "",
                topic: quizz?.topic ?? "",
                level: quizz?.level ?? "",
                question: quizz?.question ?? "",
                explaining: quizz?.explaining ?? "",
                correctAnswer,
                selectedAnswerText: options[selectedAnswer] ?? "",
                correctAnswerText: options[correctAnswer] ?? "",
            };
        });

        const totalPages = Math.max(1, Math.ceil(totalElements / size));
        const pagination = {
            totalElements,
            totalPages,
            currentPage: page,
            pageSize: size,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
            first: page === 1,
            last: page >= totalPages,
        };

        const stats = {
            totalDone: totalElements,
            totalCorrect,
            overallAccuracy: totalElements > 0 ? Math.round((totalCorrect / totalElements) * 100) : 0,
        };

        return NextResponse.json({ data: { results, pagination, stats } });
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
