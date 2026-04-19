import { createStore, EStorageType, IBaseStore } from "@/lib/initialStore";

export interface IFixProblemStore extends IBaseStore {
	adminFixFixProblems: IFixProblem[];

	setAdminFixFixProblems: (cards: IFixProblem[]) => void;
	removeFromAdminFixFixProblems: (cardId: string) => void;
	addToAdminFixFixProblems: (card: IFixProblem) => void;
	updateInAdminFixFixProblems: (card: IFixProblem) => void;

	reset: () => void;
}

const storeName = "FixProblem";
const initialState = {
	adminFixFixProblems: [],
};

export const useFixProblemStore = createStore<IFixProblemStore>(
	storeName,
	initialState,
	(set, get) => ({
		setAdminFixFixProblems: (cards: IFixProblem[]): void => {
			set({ adminFixFixProblems: cards });
		},

		removeFromAdminFixFixProblems: (cardId: string): void => {
			set({
				adminFixFixProblems: get().adminFixFixProblems.filter((c) => c.id !== cardId),
			});
		},

		addToAdminFixFixProblems: (card: IFixProblem): void => {
			set({ adminFixFixProblems: [card, ...get().adminFixFixProblems] });
		},

		updateInAdminFixFixProblems: (card: IFixProblem): void => {
			set({
				adminFixFixProblems: get().adminFixFixProblems.map((c) =>
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