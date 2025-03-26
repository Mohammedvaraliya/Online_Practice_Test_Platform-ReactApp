export type Question = {
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: string;
  tags: string[];
  explanation: string;
  references: string[];
  userAnswer?: string | null;
  userScore?: number | null;
}

export type QuizCompletedProps = {
  questions: Question[];
  score: number;
  correctAnswerCount: number;
}

export type QuestionOptionsProps = {
  options: string[];
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

export type ResultEvaluationWithPiChartProps = {
  data: { id: number; value: number; label: string }[];
}

export interface QuizHistoryItem {
  _id: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  difficultyBreakdown: { easy: number; medium: number; hard: number };
  date: string;
}