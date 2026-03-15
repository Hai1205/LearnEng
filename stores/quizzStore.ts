import { createStore, EStorageType, IBaseStore } from "@/lib/initialStore";

export interface IQuizzStore extends IBaseStore {
	adminQuizzes: IQuizz[];
	selectedCategories: string[];
	selectedTopics: string[];

	setAdminQuizzes: (cards: IQuizz[]) => void;
	removeFromAdminQuizzes: (cardId: string) => void;
	addToAdminQuizzes: (card: IQuizz) => void;
	updateInAdminQuizzes: (card: IQuizz) => void;
	setSelectedCategories: (categories: string[]) => void;
	setSelectedTopics: (topics: string[]) => void;

	reset: () => void;
}

const storeName = "quizz";
const initialState = {
	adminQuizzes: [],
	selectedCategories: [],
	selectedTopics: [],
};

export const useQuizzStore = createStore<IQuizzStore>(
	storeName,
	initialState,
	(set, get) => ({
		setAdminQuizzes: (cards: IQuizz[]): void => {
			set({ adminQuizzes: cards });
		},

		removeFromAdminQuizzes: (cardId: string): void => {
			set({
				adminQuizzes: get().adminQuizzes.filter((c) => c.id !== cardId),
			});
		},

		addToAdminQuizzes: (card: IQuizz): void => {
			set({ adminQuizzes: [card, ...get().adminQuizzes] });
		},

		updateInAdminQuizzes: (card: IQuizz): void => {
			set({
				adminQuizzes: get().adminQuizzes.map((c) =>
					c.id === card.id ? card : c
				),
			});
		},

		setSelectedCategories: (categories: string[]): void => {
			set({ selectedCategories: categories });
		},

		setSelectedTopics: (topics: string[]): void => {
			set({ selectedTopics: topics });
		},

		reset: () => {
			set({ ...initialState });
		},
	}),
	{ storageType: EStorageType.SESSION }
);