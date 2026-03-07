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
        const { category, topic, level, question, options, answer } = body;

        const db = await getDb();
        const result = await db.collection("quizzes").findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...(category !== undefined && { category }),
                    ...(topic !== undefined && { topic }),
                    ...(level !== undefined && { level }),
                    ...(question !== undefined && { question }),
                    ...(options !== undefined && { options }),
                    ...(answer !== undefined && { answer }),
                    updatedAt: new Date(),
                },
            },
            { returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json(
                { error: "Quiz not found" },
                { status: 404 }
            );
        }

        const card: IQuizz = {
            id: result._id.toString(),
            category: result.category ?? "",
            topic: result.topic ?? "",
            level: result.level ?? "",
            question: result.question ?? "",
            options: result.options ?? [],
            answer: result.answer ?? 0,
        };

        return NextResponse.json({ data: { card } });
    } catch (error) {
        console.error("PUT /api/quizzes/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update quiz" },
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
            .collection("quizzes")
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Quiz not found" },
                { status: 404 }
            );
        }

        // Also clean up any quiz results for this quiz
        await db.collection("quizz_results").deleteMany({ quizzId: id });

        return NextResponse.json({ data: { success: true } });
    } catch (error) {
        console.error("DELETE /api/quizzes/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete quiz" },
            { status: 500 }
        );
    }
}
