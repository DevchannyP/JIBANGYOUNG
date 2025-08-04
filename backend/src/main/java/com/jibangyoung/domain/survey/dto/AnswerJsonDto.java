package com.jibangyoung.domain.survey.dto;

import java.util.Map;

import lombok.Data;

@Data
public class AnswerJsonDto {
    private Long userId; // 추가
    private Map<String, Answer> answers;
    private Metadata metadata;

    @Data
    public static class Answer {
        private Object value;
        private Object text;
        private Object weight;
        private long timestamp;
    }

    @Data
    public static class Metadata {
        private String completedAt;
        private long duration;
        private String userAgent;
        private String sessionId;
    }
}
