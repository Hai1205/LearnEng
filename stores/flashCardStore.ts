import { createStore, EStorageType, IBaseStore } from "@/lib/initialStore";

export interface IFlashCardStore extends IBaseStore {
	adminFlashCards: IFlashCard[];

	setAdminFlashCards: (cards: IFlashCard[]) => void;
	removeFromAdminFlashCards: (cardId: string) => void;
	addToAdminFlashCards: (card: IFlashCard) => void;
	updateInAdminFlashCards: (card: IFlashCard) => void;

	reset: () => void;
}

const storeName = "flash-card";
const initialState = {
	adminFlashCards: [],
};

export const useFlashCardStore = createStore<IFlashCardStore>(
	storeName,
	initialState,
	(set, get) => ({
		setAdminFlashCards: (cards: IFlashCard[]): void => {
			set({ adminFlashCards: cards });
		},

		removeFromAdminFlashCards: (cardId: string): void => {
			set({
				adminFlashCards: get().adminFlashCards.filter((c) => c.id !== cardId),
			});
		},

		addToAdminFlashCards: (card: IFlashCard): void => {
			set({ adminFlashCards: [card, ...get().adminFlashCards] });
		},

		updateInAdminFlashCards: (card: IFlashCard): void => {
			set({
				adminFlashCards: get().adminFlashCards.map((c) =>
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