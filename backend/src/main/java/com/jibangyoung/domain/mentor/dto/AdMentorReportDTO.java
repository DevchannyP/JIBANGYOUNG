package com.jibangyoung.domain.mentor.dto;

import java.time.LocalDateTime;

import com.jibangyoung.domain.mypage.entity.ReportTargetType;
import com.jibangyoung.domain.mypage.entity.ReviewResultCode;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
public class AdMentorReportDTO {
    private Long id;              // 신고 id
    private Long userId;          // 신고자 id
    private String reporterName;  // 신고자 닉네임
    private ReportTargetType targetType; // 신고타입(ENUM)
    private Long targetId;        // 신고 대상 id (게시글/댓글 id)
    private String targetTitle;   // 게시글: title, 댓글: content
    private String reasonCode;    // 신고 사유코드
    private String reasonDetail;  // 상세 사유
    private LocalDateTime createdAt; // 신고일시
    private ReviewResultCode reviewResultCode; // 상태(ENUM)
    private LocalDateTime reviewedAt; // 검토일시
    private String reviewerName;      // 검토자 닉네임
    private Long regionId;            // 지역코드
    private String url;               // URL

    // *** JPQL에서 사용될 생성자 (파라미터 순서/타입 일치 필수!) ***
    public AdMentorReportDTO(
        Long id,
        Long userId,
        String reporterName,
        ReportTargetType targetType,
        Long targetId,
        String targetTitle,
        String reasonCode,
        String reasonDetail,
        LocalDateTime createdAt,
        ReviewResultCode reviewResultCode,
        LocalDateTime reviewedAt,
        String reviewerName,
        Long regionId,
        String url
    ) {
        this.id = id;
        this.userId = userId;
        this.reporterName = reporterName;
        this.targetType = targetType;
        this.targetId = targetId;
        this.targetTitle = targetTitle;
        this.reasonCode = reasonCode;
        this.reasonDetail = reasonDetail;
        this.createdAt = createdAt;
        this.reviewResultCode = reviewResultCode;
        this.reviewedAt = reviewedAt;
        this.reviewerName = reviewerName;
        this.regionId = regionId;
        this.url = url;
    }
}
