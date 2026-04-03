import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const FLASH_CARDS_KEY = ["test-results"];

async function fetchTestResults(): Promise<any> {
    const res = await fetch("/api/test-results");
    if (!res.ok) throw new Error("Failed to fetch test results");
    return res.json();
}

async function createTestResult(
    data: Omit<ITestResult, "id">
): Promise<any> {
    const res = await fetch("/api/test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create test result");
    return res.json();
}

async function updateTestResult({
    testId,
    data,
}: {
    testId: string;
    data: Partial<ITestResult>;
}): Promise<any> {
    const res = await fetch(`/api/test-results/${encodeURIComponent(testId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update test result");
    return res.json();
}

async function deleteTestResult(
    testId: string
): Promise<any> {
    const res = await fetch(`/api/test-results/${encodeURIComponent(testId)}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete test result");
    return res.json();
}

export function useAllTestResultsQuery() {
    return useQuery({
        queryKey: FLASH_CARDS_KEY,
        queryFn: fetchTestResults,
        staleTime: 60 * 1000,
    });
}

export function useCreateTestResultMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTestResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FLASH_CARDS_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

export function useUpdateTestResultMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTestResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FLASH_CARDS_KEY });
        },
    });
}

export function useDeleteTestResultMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTestResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FLASH_CARDS_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

async function importTestResults(
    file: File
): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/test-results/import", {
        method: "POST",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to import test results");
    }
    return res.json();
}

export function useImportTestResultsMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: importTestResults,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FLASH_CARDS_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}
