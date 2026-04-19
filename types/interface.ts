import { EFixProblemAnswer, EFixProblemErrorType } from "./enum";

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
        explaining: string
    }

    interface IFlashCard {
        id: string
        topic: string
        word: string
        meaning: string
        ipa: string
        example: string
    }
    
    interface ITestResult {
        id: string
        category: string
        title: string
        part1: number
        part2: number
        part3: number
        part4: number
        part5: number
        part6: number
        part7: number
        score: number
    }

    interface IFixProblem {
        id: string
        category: string
        question: string
        errorType: EFixProblemErrorType
        reason: string
        answer: EFixProblemAnswer
        note: string
    }

    interface IQuizzResult {
        id: string
        quizzId: string
        selectedAnswer: number
        isCorrect: boolean
        answeredAt: string
    }

    interface IQuizzHistoryItem extends IQuizzResult {
        category: string
        topic: string
        level: string
        question: string
        explaining: string
        correctAnswer: number
        selectedAnswerText: string
        correctAnswerText: string
    }

    interface IWordProgress {
        id: string
        flashCardId: string
        isMemorized: boolean
        updatedAt: string
    }
}

export { };