import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PART_MAX = {
    part1: 6,
    part2: 25,
    part3: 39,
    part4: 30,
    part5: 30,
    part6: 16,
    part7: 54,
};

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
        const collection = db.collection("test_results");

        const [docs, totalElements] = await Promise.all([
            collection.find({}).sort({ createdAt: -1 }).skip(skip).limit(size).toArray(),
            collection.countDocuments({}),
        ]);

        const results: ITestResult[] = docs.map((doc) => ({
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
        }));

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
            totalTests: totalElements,
            averageScore:
                totalElements > 0
                    ? Math.round(
                        (docs.reduce((s: number, d: any) => s + Number(d.score ?? (
                            Number(d.part1 ?? 0) + Number(d.part2 ?? 0) + Number(d.part3 ?? 0) + Number(d.part4 ?? 0) + Number(d.part5 ?? 0) + Number(d.part6 ?? 0) + Number(d.part7 ?? 0)
                        )), 0) / totalElements) * 100
                    ) / 100
                    : 0,
        };

        return NextResponse.json({ data: { results, pagination, stats } });
    } catch (error) {
        console.error("GET /api/test-results error:", error);
        return NextResponse.json({ error: "Failed to fetch test results" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { category, title, part1, part2, part3, part4, part5, part6, part7, score } = body;

        if (!category || !title) {
            return NextResponse.json({ error: "category and title are required" }, { status: 400 });
        }

        const parts = {
            part1: Number(part1 ?? NaN),
            part2: Number(part2 ?? NaN),
            part3: Number(part3 ?? NaN),
            part4: Number(part4 ?? NaN),
            part5: Number(part5 ?? NaN),
            part6: Number(part6 ?? NaN),
            part7: Number(part7 ?? NaN),
        };

        for (const key of Object.keys(parts)) {
            const k = key as keyof typeof parts;
            if (!Number.isFinite(parts[k]) || parts[k] < 0 || parts[k] > (PART_MAX[k] as number)) {
                return NextResponse.json({ error: `${k} must be a number between 0 and ${PART_MAX[k as keyof typeof PART_MAX]}` }, { status: 400 });
            }
        }

        const computedScore = parts.part1 + parts.part2 + parts.part3 + parts.part4 + parts.part5 + parts.part6 + parts.part7;
        const finalScore =
            score !== undefined && score !== null && score !== ""
                ? Number(score)
                : computedScore;

        if (!Number.isFinite(finalScore) || finalScore < 0 || finalScore > 990) {
            return NextResponse.json({ error: "score must be a number between 0 and 990" }, { status: 400 });
        }

        const db = await getDb();
        const result = await db.collection("test_results").insertOne({
            category,
            title,
            ...parts,
            score: finalScore,
            createdAt: new Date(),
        });

        const created: ITestResult = {
            id: result.insertedId.toString(),
            category,
            title,
            part1: parts.part1,
            part2: parts.part2,
            part3: parts.part3,
            part4: parts.part4,
            part5: parts.part5,
            part6: parts.part6,
            part7: parts.part7,
            score: finalScore,
        };

        return NextResponse.json({ data: { result: created } }, { status: 201 });
    } catch (error) {
        console.error("POST /api/test-results error:", error);
        return NextResponse.json({ error: "Failed to create test result" }, { status: 500 });
    }
}
