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
        cat: string
        topic: string
        lvl: string
        q: string
        opts: string[]
        ans: number
    }

    interface IFlashCard {
        id: string
        topic: string
        vol: string
        transcription: string
        audioUrl: string
        ex: string
    }

    interface IQuizzResult {
        id: string
        quizzId: string
        selectedAnswer: number
        isCorrect: boolean
        answeredAt: string
    }

    interface IVocabularyProgress {
        id: string
        flashCardId: string
        isMemorized: boolean
        updatedAt: string
    }

    interface IDashboardStats {
        totalQuestions: number
        correctAnswers: number
        wrongAnswers: number
        totalVocabulary: number
        memorizedVocabulary: number
        unmemorizedVocabulary: number
    }
}

export { };