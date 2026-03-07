import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const FLASH_CARDS_KEY = ["flash-cards"];

async function fetchFlashCards(): Promise<{ data: { cards: IFlashCard[] } }> {
    const res = await fetch("/api/flash-cards");
    if (!res.ok) throw new Error("Failed to fetch flash cards");
    return res.json();
}

async function createFlashCard(
    data: Omit<IFlashCard, "id">
): Promise<{ data: { card: IFlashCard } }> {
    const res = await fetch("/api/flash-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create flash card");
    return res.json();
}

async function updateFlashCard({
    cardId,
    data,
}: {
    cardId: string;
    data: Partial<IFlashCard>;
}): Promise<{ data: { card: IFlashCard } }> {
    const res = await fetch(`/api/flash-cards/${encodeURIComponent(cardId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update flash card");
    return res.json();
}

async function deleteFlashCard(
    cardId: string
): Promise<{ data: { success: boolean } }> {
    const res = await fetch(`/api/flash-cards/${encodeURIComponent(cardId)}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete flash card");
    return res.json();
}

export function useAllFlashCardsQuery() {
    return useQuery({
        queryKey: FLASH_CARDS_KEY,
        queryFn: fetchFlashCards,
        staleTime: 60 * 1000,
    });
}

export function useCreateFlashCardMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFlashCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FLASH_CARDS_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

export function useUpdateFlashCardMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateFlashCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FLASH_CARDS_KEY });
        },
    });
}

export function useDeleteFlashCardMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteFlashCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FLASH_CARDS_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

async function importFlashCards(
    file: File
): Promise<{ data: { cards: IFlashCard[]; imported: number; errors?: string[] } }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/flash-cards/import", {
        method: "POST",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to import flash cards");
    }
    return res.json();
}

export function useImportFlashCardsMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: importFlashCards,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FLASH_CARDS_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}
