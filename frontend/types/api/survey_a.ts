export interface AnswerFormat {
  answers: {
    [questionCode: string]: {
      value: string | number | (string | number)[];
      text?: string | string[];
      weight?: number | number[];
      timestamp: number;
    };
  };
  metadata: {
    completedAt: string;
    duration: number;
    userAgent: string;
    sessionId: string;
  };
}