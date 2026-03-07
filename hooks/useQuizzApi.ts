import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUIZZES_KEY = ["quizzes"];

async function fetchQuizzes(): Promise<{ data: { cards: IQuizz[] } }> {
    const res = await fetch("/api/quizzes");
    if (!res.ok) throw new Error("Failed to fetch quizzes");
    return res.json();
}

async function createQuizz(
    data: Omit<IQuizz, "id">
): Promise<{ data: { card: IQuizz } }> {
    const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create quiz");
    return res.json();
}

async function updateQuizz({
    cardId,
    data,
}: {
    cardId: string;
    data: Partial<IQuizz>;
}): Promise<{ data: { card: IQuizz } }> {
    const res = await fetch(`/api/quizzes/${encodeURIComponent(cardId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update quiz");
    return res.json();
}

async function deleteQuizz(
    cardId: string
): Promise<{ data: { success: boolean } }> {
    const res = await fetch(`/api/quizzes/${encodeURIComponent(cardId)}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete quiz");
    return res.json();
}

export function useAllQuizzesQuery() {
    return useQuery({
        queryKey: QUIZZES_KEY,
        queryFn: fetchQuizzes,
        staleTime: 60 * 1000,
    });
}

export function useCreateQuizzMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createQuizz,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUIZZES_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

export function useUpdateQuizzMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateQuizz,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUIZZES_KEY });
        },
    });
}

export function useDeleteQuizzMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteQuizz,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUIZZES_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

async function importQuizzes(
    file: File
): Promise<{ data: { cards: IQuizz[]; imported: number; errors?: string[] } }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/quizzes/import", {
        method: "POST",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to import quizzes");
    }
    return res.json();
}

export function useImportQuizzesMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: importQuizzes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUIZZES_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}
