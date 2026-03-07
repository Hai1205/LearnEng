import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const VOCAB_PROGRESS_KEY = ["vocabulary-progress"];

async function fetchVocabularyProgress(): Promise<{
    data: { progress: IVocabularyProgress[] };
}> {
    const res = await fetch("/api/vocabulary-progress");
    if (!res.ok) throw new Error("Failed to fetch vocabulary progress");
    return res.json();
}

async function updateVocabularyProgress(data: {
    flashCardId: string;
    isMemorized: boolean;
}): Promise<{ data: { progress: IVocabularyProgress } }> {
    const res = await fetch("/api/vocabulary-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update vocabulary progress");
    return res.json();
}

export function useVocabularyProgressQuery() {
    return useQuery({
        queryKey: VOCAB_PROGRESS_KEY,
        queryFn: fetchVocabularyProgress,
        staleTime: 60 * 1000,
    });
}

export function useUpdateVocabularyProgressMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateVocabularyProgress,
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: VOCAB_PROGRESS_KEY });
            const previous = queryClient.getQueryData<{
                data: { progress: IVocabularyProgress[] };
            }>(VOCAB_PROGRESS_KEY);

            queryClient.setQueryData<{
                data: { progress: IVocabularyProgress[] };
            }>(VOCAB_PROGRESS_KEY, (old) => {
                if (!old) return old;
                const existing = old.data.progress.find(
                    (p) => p.flashCardId === variables.flashCardId,
                );
                if (existing) {
                    return {
                        data: {
                            progress: old.data.progress.map((p) =>
                                p.flashCardId === variables.flashCardId
                                    ? { ...p, isMemorized: variables.isMemorized }
                                    : p,
                            ),
                        },
                    };
                }
                return {
                    data: {
                        progress: [
                            ...old.data.progress,
                            {
                                flashCardId: variables.flashCardId,
                                isMemorized: variables.isMemorized,
                            } as IVocabularyProgress,
                        ],
                    },
                };
            });
            return { previous };
        },
        onError: (_err, _variables, context) => {
            if (context?.previous) {
                queryClient.setQueryData(VOCAB_PROGRESS_KEY, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: VOCAB_PROGRESS_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}
