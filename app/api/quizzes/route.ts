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
            cat: doc.cat ?? "",
            topic: doc.topic ?? "",
            lvl: doc.lvl ?? "",
            q: doc.q ?? "",
            opts: doc.opts ?? [],
            ans: doc.ans ?? 0,
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
        const { cat, topic, lvl, q, opts, ans } = body;

        if (!cat || !topic || !q || !opts || !Array.isArray(opts)) {
            return NextResponse.json(
                { error: "cat, topic, q, and opts are required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const result = await db.collection("quizzes").insertOne({
            cat,
            topic,
            lvl: lvl ?? "",
            q,
            opts,
            ans: typeof ans === "number" ? ans : 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const card: IQuizz = {
            id: result.insertedId.toString(),
            cat,
            topic,
            lvl: lvl ?? "",
            q,
            opts,
            ans: typeof ans === "number" ? ans : 0,
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
