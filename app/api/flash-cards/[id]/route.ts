import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const body = await request.json();
        const { topic, word, meaning, ipa, audioUrl, example } = body;

        const db = await getDb();
        const result = await db.collection("flashcards").findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...(topic !== undefined && { topic }),
                    ...(word !== undefined && { word }),
                    ...(meaning !== undefined && { meaning }),
                    ...(ipa !== undefined && { ipa }),
                    ...(example !== undefined && { example }),
                    updatedAt: new Date(),
                },
            },
            { returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json(
                { error: "Flash card not found" },
                { status: 404 }
            );
        }

        const card: IFlashCard = {
            id: result._id.toString(),
            topic: result.topic ?? "",
            word: result.word ?? "",
            meaning: result.meaning ?? "",
            ipa: result.ipa ?? "",
            example: result.example ?? "",
        };

        return NextResponse.json({ data: { card } });
    } catch (error) {
        console.error("PUT /api/flash-cards/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update flash card" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const db = await getDb();
        const result = await db
            .collection("flashcards")
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Flash card not found" },
                { status: 404 }
            );
        }

        // Also clean up any Word progress for this card
        await db.collection("Word_progress").deleteMany({ flashCardId: id });

        return NextResponse.json({ data: { success: true } });
    } catch (error) {
        console.error("DELETE /api/flash-cards/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete flash card" },
            { status: 500 }
        );
    }
}
