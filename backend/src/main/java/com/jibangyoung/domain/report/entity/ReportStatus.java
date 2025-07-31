package com.jibangyoung.domain.report.entity;

public enum ReportStatus {
    APPROVED("승인"),
    IGNORED("무시"),
    PENDING("대기"),
    REJECTED("거절");

    private final String description;
    ReportStatus(String description) { this.description = description; }
    public String getDescription() { return description; }
}