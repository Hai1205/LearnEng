import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUIZZES_KEY = ["fix-problems"];

async function fetchFixProblem(): Promise<{ data: { cards: IFixProblem[] } }> {
    const res = await fetch("/api/fix-problems");
    if (!res.ok) throw new Error("Failed to fetch fix-problems");
    return res.json();
}

async function createFixProblem(
    data: Omit<IFixProblem, "id">
): Promise<{ data: { card: IFixProblem } }> {
    const res = await fetch("/api/fix-problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create quiz");
    return res.json();
}

async function updateFixProblem({
    cardId,
    data,
}: {
    cardId: string;
    data: Partial<IFixProblem>;
}): Promise<{ data: { card: IFixProblem } }> {
    const res = await fetch(`/api/fix-problems/${encodeURIComponent(cardId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update quiz");
    return res.json();
}

async function deleteFixProblem(
    cardId: string
): Promise<{ data: { success: boolean } }> {
    const res = await fetch(`/api/fix-problems/${encodeURIComponent(cardId)}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete quiz");
    return res.json();
}

export function useAllFixProblemsQuery() {
    return useQuery({
        queryKey: QUIZZES_KEY,
        queryFn: fetchFixProblem,
        staleTime: 60 * 1000,
    });
}

export function useCreateFixProblemMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFixProblem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUIZZES_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

export function useUpdateFixProblemMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateFixProblem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUIZZES_KEY });
        },
    });
}

export function useDeleteFixProblemMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteFixProblem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUIZZES_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

async function importFixProblems(
    file: File
): Promise<{ data: { cards: IFixProblem[]; imported: number; errors?: string[] } }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/fix-problems/import", {
        method: "POST",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to import fix-problems");
    }
    return res.json();
}

export function useImportFixProblemsMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: importFixProblems,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUIZZES_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}
