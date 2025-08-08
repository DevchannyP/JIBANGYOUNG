package com.jibangyoung.domain.mypage.entity;

import java.time.LocalDateTime;

import com.jibangyoung.domain.auth.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 신고 이력 엔티티
 * - user_id 인덱스 최적화
 * - 연관관계 LAZY, Enum 명확화
 */
// com.jibangyoung.domain.mypage.entity.Report.java
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "reports", indexes = {
        @Index(name = "idx_report_user", columnList = "user_id"),
        @Index(name = "idx_report_target", columnList = "target_type_code, target_id")
})
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type_code", nullable = false, length = 24)
    private ReportTargetType targetType; // Enum: POST/COMMENT/USER/POLICY 등

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "reason_code", nullable = false, length = 40)
    private String reasonCode;

    @Column(name = "reason_detail", columnDefinition = "TEXT")
    private String reasonDetail;

    @Enumerated(EnumType.STRING)
    @Column(name = "review_result_code", nullable = false, length = 20)
    private ReviewResultCode reviewResultCode = ReviewResultCode.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    // 멘토 데시보드_신고목록(상태변경)
    public void setReviewResultCode(ReviewResultCode reviewResultCode) {
        this.reviewResultCode = reviewResultCode;
    }
    public void setReviewedAt(LocalDateTime reviewedAt){
        this.reviewedAt = reviewedAt;
    }
    public void setReviewedBy(Long reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
    
    // 정적 팩토리 메서드
    public static Report createReport(User user, ReportTargetType targetType, Long targetId, 
                                    String reasonCode, String reasonDetail) {
        Report report = new Report();
        report.user = user;
        report.targetType = targetType;
        report.targetId = targetId;
        report.reasonCode = reasonCode;
        report.reasonDetail = reasonDetail;
        report.reviewResultCode = ReviewResultCode.PENDING;
        report.createdAt = LocalDateTime.now();
        return report;
    }
}
