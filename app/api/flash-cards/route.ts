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
            vol: doc.vol ?? "",
            transcription: doc.transcription ?? "",
            audioUrl: doc.audioUrl ?? "",
            ex: doc.ex ?? "",
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
        const { topic, vol, transcription, audioUrl, ex } = body;

        if (!topic || !vol) {
            return NextResponse.json(
                { error: "topic and vol are required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const result = await db.collection("flashcards").insertOne({
            topic,
            vol,
            transcription: transcription ?? "",
            audioUrl: audioUrl ?? "",
            ex: ex ?? "",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const card: IFlashCard = {
            id: result.insertedId.toString(),
            topic,
            vol,
            transcription: transcription ?? "",
            audioUrl: audioUrl ?? "",
            ex: ex ?? "",
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
