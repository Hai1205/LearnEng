import { createStore, EStorageType, IBaseStore } from "@/lib/initialStore";

export interface ITestResultStore extends IBaseStore {
	adminTestResults: ITestResult[];

	setAdminTestResults: (cards: ITestResult[]) => void;
	removeFromAdminTestResults: (cardId: string) => void;
	addToAdminTestResults: (card: ITestResult) => void;
	updateInAdminTestResults: (card: ITestResult) => void;

	reset: () => void;
}

const storeName = "flash-card";
const initialState = {
	adminTestResults: [],
};

export const useTestResultStore = createStore<ITestResultStore>(
	storeName,
	initialState,
	(set, get) => ({
		setAdminTestResults: (cards: ITestResult[]): void => {
			set({ adminTestResults: cards });
		},

		removeFromAdminTestResults: (cardId: string): void => {
			set({
				adminTestResults: get().adminTestResults.filter((c) => c.id !== cardId),
			});
		},

		addToAdminTestResults: (card: ITestResult): void => {
			set({ adminTestResults: [card, ...get().adminTestResults] });
		},

		updateInAdminTestResults: (card: ITestResult): void => {
			set({
				adminTestResults: get().adminTestResults.map((c) =>
					c.id === card.id ? card : c
				),
			});
		},

		reset: () => {
			set({ ...initialState });
		},
	}),
	{ storageType: EStorageType.SESSION }
);