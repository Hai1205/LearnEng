import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const db = await getDb();
        const docs = await db.collection("flashcards").find({}).toArray();
        const cards: IFlashCard[] = docs.map((doc) => ({
            id: doc._id.toString(),
            topic: doc.topic ?? "",
            word: doc.word ?? "",
            meaning: doc.meaning ?? "",
            ipa: doc.ipa ?? "",
            audioUrl: doc.audioUrl ?? "",
            example: doc.example ?? "",
        }));
        return NextResponse.json({ data: { cards } });
    } catch (error) {
        console.error("GET /api/flash-cards error:", error);
        return NextResponse.json(
            { error: "Failed to fetch flash cards" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topic, word, meaning, ipa, audioUrl, example } = body;

        if (!topic || !word) {
            return NextResponse.json(
                { error: "topic and word are required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const result = await db.collection("flashcards").insertOne({
            topic,
            word,
            meaning: meaning ?? "",
            ipa: ipa ?? "",
            audioUrl: audioUrl ?? "",
            example: example ?? "",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const card: IFlashCard = {
            id: result.insertedId.toString(),
            topic,
            word,
            meaning: meaning ?? "",
            ipa: ipa ?? "",
            example: example ?? "",
        };

        return NextResponse.json({ data: { card } }, { status: 201 });
    } catch (error) {
        console.error("POST /api/flash-cards error:", error);
        return NextResponse.json(
            { error: "Failed to create flash card" },
            { status: 500 }
        );
    }
}
