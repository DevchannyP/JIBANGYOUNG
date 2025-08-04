package com.jibangyoung.domain.mentor.entity;

import io.micrometer.core.annotation.Counted;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="mentor_certification_requests")
public class MentorCertificationRequests {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 멘토 신청자
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // 멘토 증빙 서류 URL
    @Column(name = "document_url")
    private String documentUrl;

    // 신청 검토 관리자ID
    @Column(name = "reviewed_by")
    private Long reviewedBy;

    // 검토 일시
    @Column(name ="reviewed_at")
    private LocalDateTime reviewedAt;

    // 신청 지역 코드
    @Column(name = "region_id", nullable = false)
    private long regionId;
    
    // 신청사유
    @Column(name = "reason", length = 1000)
    private String reason;

    // 행정 기관
    @Column(name = "government_agency", nullable = false)
    private Boolean governmentAgency;
    
    // 거절 이유
    @Column(name ="rejection_reason")
    private String rejectionReason;

    // 신청 일시
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Getter
    public enum Status {
        APPROVED("멘토 승인"),
        PENDING("승인 대기"),
        REJECTED("멘토 미승인");

        private final String description;

        Status(String description) {
            this.description = description;
        }
    }
}
