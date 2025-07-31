package com.jibangyoung.domain.report.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reports")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 신고자(유저) ID
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // 신고 대상 구분 (예: COMMENT, POST 등)
    @Column(name = "target_type_code", nullable = false, length = 30)
    private String targetTypeCode;

    // 신고 대상 ID
    @Column(name = "target_id", nullable = false)
    private Long targetId;

    // 신고 코드(사유)
    @Column(name = "reason_code", length = 40)
    private String reasonCode;

    // 상세 신고 사유
    @Column(name = "reason_detail", length = 1000)
    private String reasonDetail;

    // 신고 생성일시
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 신고 결과(상태)
    @Enumerated(EnumType.STRING)
    @Column(name = "review_result_code", length = 20)
    private ReportStatus reviewResultCode;

    // 검토 완료일시
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    // 검토자(멘토 등) 유저 ID
    @Column(name = "reviewed_by")
    private Long reviewedBy;

    // 생성일시 자동 처리
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}