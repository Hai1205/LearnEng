import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUIZZ_RESULTS_KEY = ["quizz-results"];

async function fetchQuizzResults(): Promise<{
    data: { results: IQuizzResult[] };
}> {
    const res = await fetch("/api/quizz-results");
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
    return useQuery({
        queryKey: QUIZZ_RESULTS_KEY,
        queryFn: fetchQuizzResults,
        staleTime: 60 * 1000,
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
