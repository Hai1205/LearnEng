declare global {
    interface IPageable {
        page: number;
        size: number;
        sort?: string;
    }

    interface IPageResponse<T> {
        content: T[];
        totalElements: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        hasNext: boolean;
        hasPrevious: boolean;
        first: boolean;
        last: boolean;
    }

    interface IQuizz {
        id: string
        category: string
        topic: string
        level: string
        question: string
        options: string[]
        answer: number
        explaining?: string
    }

    interface IFlashCard {
        id: string
        topic: string
        word: string
        meaning: string
        ipa: string
        example: string
    }

    interface IQuizzResult {
        id: string
        quizzId: string
        selectedAnswer: number
        isCorrect: boolean
        answeredAt: string
    }

    interface IWordProgress {
        id: string
        flashCardId: string
        isMemorized: boolean
        updatedAt: string
    }

    interface IDashboardStats {
        totalQuestions: number
        correctAnswers: number
        wrongAnswers: number
        totalWord: number
        memorizedWord: number
        unmemorizedWord: number
    }
}

export { };