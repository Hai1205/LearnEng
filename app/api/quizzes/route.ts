import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const db = await getDb();
        const docs = await db.collection("quizzes").find({}).toArray();
        const cards: IQuizz[] = docs.map((doc) => ({
            id: doc._id.toString(),
            category: doc.category ?? "",
            topic: doc.topic ?? "",
            level: doc.level ?? "",
            question: doc.question ?? "",
            options: doc.options ?? [],
            answer: doc.answer ?? 0,
            explaining: doc.explaining ?? "",
        }));
        return NextResponse.json({ data: { cards } });
    } catch (error) {
        console.error("GET /api/quizzes error:", error);
        return NextResponse.json(
            { error: "Failed to fetch quizzes" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { category, topic, level, question, options, answer, explaining } = body;

        if (!category || !topic || !question || !options || !Array.isArray(options)) {
            return NextResponse.json(
                { error: "category, topic, question, and options are required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const result = await db.collection("quizzes").insertOne({
            category,
            topic,
            level: level ?? "",
            question,
            options,
            answer: typeof answer === "number" ? answer : 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const card: IQuizz = {
            id: result.insertedId.toString(),
            category,
            topic,
            level: level ?? "",
            question,
            options,
            answer: typeof answer === "number" ? answer : 0,
            explaining: explaining ?? "",
        };

        return NextResponse.json({ data: { card } }, { status: 201 });
    } catch (error) {
        console.error("POST /api/quizzes error:", error);
        return NextResponse.json(
            { error: "Failed to create quiz" },
            { status: 500 }
        );
    }
}
