export interface AnswerFormat {
  userId: number;  // 추가
  answers: {
    [questionCode: string]: {
      value: string | string[]; // 항상 string 또는 string[]로 고정
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
