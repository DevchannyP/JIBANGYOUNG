package com.jibangyoung.domain.survey.dto;

import java.util.Map;

import lombok.Data;

@Data
public class AnswerJsonDto {
    // userId 필드 제거!
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
