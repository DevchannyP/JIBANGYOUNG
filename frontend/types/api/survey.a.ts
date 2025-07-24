interface AnswerFormat {
  answers: {
    [questionCode: string]: {
      value: string | number | string[];
      text?: string | string[];  // 선택된 옵션의 텍스트
      weight?: number;  // 가중치 정보
      timestamp: number;         // 답변 시간
    }
  };
  metadata: {
    completedAt: string;
    duration: number;          // 총 소요 시간
    userAgent: string;
    sessionId: string;
  };
}