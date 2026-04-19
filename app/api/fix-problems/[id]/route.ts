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
        const { category, question, errorType, reason, answer, note } = body;

        const db = await getDb();
        const result = await db.collection("fix-problems").findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...(category !== undefined && { category }),
                    ...(question !== undefined && { question }),
                    ...(errorType !== undefined && { errorType }),
                    ...(reason !== undefined && { reason }),
                    ...(answer !== undefined && { answer }),
                    ...(note !== undefined && { note }),
                    updatedAt: new Date(),
                },
            },
            { returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json(
                { error: "Fix problem not found" },
                { status: 404 }
            );
        }

        const card: IFixProblem = {
            id: result._id.toString(),
            category: result.category ?? "",
            question: result.question ?? "",
            errorType: result.errorType ?? "",
            reason: result.reason ?? "",
            answer: result.answer ?? 0,
            note: result.note ?? "",
        };

        return NextResponse.json({ data: { card } });
    } catch (error) {
        console.error("PUT /api/fix-problems/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update fix problem" },
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
            .collection("fix-problems")
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Fix problem not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: { success: true } });
    } catch (error) {
        console.error("DELETE /api/fix-problems/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete fix problem" },
            { status: 500 }
        );
    }
}
