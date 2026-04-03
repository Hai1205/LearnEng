import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const db = await getDb();
        const doc = await db.collection("test_results").findOne({ _id: new ObjectId(id) });
        if (!doc) {
            return NextResponse.json({ error: "Test result not found" }, { status: 404 });
        }

        const result: ITestResult = {
            id: doc._id.toString(),
            category: doc.category ?? "",
            title: doc.title ?? "",
            part1: Number(doc.part1 ?? 0),
            part2: Number(doc.part2 ?? 0),
            part3: Number(doc.part3 ?? 0),
            part4: Number(doc.part4 ?? 0),
            part5: Number(doc.part5 ?? 0),
            part6: Number(doc.part6 ?? 0),
            part7: Number(doc.part7 ?? 0),
            score: Number(doc.score ?? (
                Number(doc.part1 ?? 0) + Number(doc.part2 ?? 0) + Number(doc.part3 ?? 0) + Number(doc.part4 ?? 0) + Number(doc.part5 ?? 0) + Number(doc.part6 ?? 0) + Number(doc.part7 ?? 0)
            )),
        };

        return NextResponse.json({ data: { result } });
    } catch (error) {
        console.error("GET /api/test-results/[id] error:", error);
        return NextResponse.json({ error: "Failed to fetch test result" }, { status: 500 });
    }
}

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
        const { category, title, part1, part2, part3, part4, part5, part6, part7, score } = body;

        const update: any = {};
        if (category !== undefined) update.category = category;
        if (title !== undefined) update.title = title;
        if (part1 !== undefined) update.part1 = Number(part1);
        if (part2 !== undefined) update.part2 = Number(part2);
        if (part3 !== undefined) update.part3 = Number(part3);
        if (part4 !== undefined) update.part4 = Number(part4);
        if (part5 !== undefined) update.part5 = Number(part5);
        if (part6 !== undefined) update.part6 = Number(part6);
        if (part7 !== undefined) update.part7 = Number(part7);

        const db = await getDb();
        const existing = await db.collection("test_results").findOne({ _id: new ObjectId(id) });
        if (!existing) {
            return NextResponse.json({ error: "Test result not found" }, { status: 404 });
        }

        const finalPart1 = update.part1 !== undefined ? update.part1 : Number(existing.part1 ?? 0);
        const finalPart2 = update.part2 !== undefined ? update.part2 : Number(existing.part2 ?? 0);
        const finalPart3 = update.part3 !== undefined ? update.part3 : Number(existing.part3 ?? 0);
        const finalPart4 = update.part4 !== undefined ? update.part4 : Number(existing.part4 ?? 0);
        const finalPart5 = update.part5 !== undefined ? update.part5 : Number(existing.part5 ?? 0);
        const finalPart6 = update.part6 !== undefined ? update.part6 : Number(existing.part6 ?? 0);
        const finalPart7 = update.part7 !== undefined ? update.part7 : Number(existing.part7 ?? 0);

        const computedScore = finalPart1 + finalPart2 + finalPart3 + finalPart4 + finalPart5 + finalPart6 + finalPart7;
        const finalScore =
            score !== undefined && score !== null && score !== ""
                ? Number(score)
                : computedScore;

        if (!Number.isFinite(finalScore) || finalScore < 0 || finalScore > 990) {
            return NextResponse.json({ error: "score must be a number between 0 and 990" }, { status: 400 });
        }

        update.score = finalScore;
        update.updatedAt = new Date();

        const updatedDoc = await db.collection("test_results").findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: update },
            { returnDocument: "after" }
        );

        if (!updatedDoc) {
            return NextResponse.json({ error: "Failed to update test result" }, { status: 500 });
        }

        const updated: ITestResult = {
            id: updatedDoc._id.toString(),
            category: updatedDoc.category ?? "",
            title: updatedDoc.title ?? "",
            part1: Number(updatedDoc.part1 ?? 0),
            part2: Number(updatedDoc.part2 ?? 0),
            part3: Number(updatedDoc.part3 ?? 0),
            part4: Number(updatedDoc.part4 ?? 0),
            part5: Number(updatedDoc.part5 ?? 0),
            part6: Number(updatedDoc.part6 ?? 0),
            part7: Number(updatedDoc.part7 ?? 0),
            score: Number(updatedDoc.score ?? (
                Number(updatedDoc.part1 ?? 0) + Number(updatedDoc.part2 ?? 0) + Number(updatedDoc.part3 ?? 0) + Number(updatedDoc.part4 ?? 0) + Number(updatedDoc.part5 ?? 0) + Number(updatedDoc.part6 ?? 0) + Number(updatedDoc.part7 ?? 0)
            )),
        };

        return NextResponse.json({ data: { result: updated } });
    } catch (error) {
        console.error("PUT /api/test-results/[id] error:", error);
        return NextResponse.json({ error: "Failed to update test result" }, { status: 500 });
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
        const result = await db.collection("test_results").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Test result not found" }, { status: 404 });
        }

        return NextResponse.json({ data: { success: true } });
    } catch (error) {
        console.error("DELETE /api/test-results/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete test result" }, { status: 500 });
    }
}
