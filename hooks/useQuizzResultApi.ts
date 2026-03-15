import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUIZZ_RESULTS_KEY = ["quizz-results"];

interface IQuizzResultsResponse {
    data: {
        results: IQuizzHistoryItem[];
        pagination: {
            totalElements: number;
            totalPages: number;
            currentPage: number;
            pageSize: number;
            hasNext: boolean;
            hasPrevious: boolean;
            first: boolean;
            last: boolean;
        };
        stats: {
            totalDone: number;
            totalCorrect: number;
            overallAccuracy: number;
        };
    };
}

async function fetchQuizzResults({
    page,
    size,
}: {
    page: number;
    size: number;
}): Promise<IQuizzResultsResponse> {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    const res = await fetch(`/api/quizz-results?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch quiz results");
    return res.json();
}

async function saveQuizzResult(data: {
    quizzId: string;
    selectedAnswer: number;
    isCorrect: boolean;
}): Promise<{ data: { result: IQuizzResult } }> {
    const res = await fetch("/api/quizz-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save quiz result");
    return res.json();
}

export function useQuizzResultsQuery() {
    const page = 1;
    const size = 10;

    return useQuery({
        queryKey: [...QUIZZ_RESULTS_KEY, page, size],
        queryFn: () => fetchQuizzResults({ page, size }),
        staleTime: 60 * 1000,
    });
}

export function useQuizzResultsHistoryQuery(page: number, size: number = 10) {
    return useQuery({
        queryKey: [...QUIZZ_RESULTS_KEY, page, size],
        queryFn: () => fetchQuizzResults({ page, size }),
        staleTime: 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnMount: "always",
    });
}

export function useSaveQuizzResultMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveQuizzResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUIZZ_RESULTS_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}
