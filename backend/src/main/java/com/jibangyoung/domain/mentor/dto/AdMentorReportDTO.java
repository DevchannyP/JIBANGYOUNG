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
    private Long id;
    private Long userId;
    private String reporterName;
    private ReportTargetType targetType;
    private Long targetId;
    private String targetTitle;
    private String reasonCode;
    private String reasonDescription;    
    private String reasonDetail;
    private LocalDateTime createdAt;
    private ReviewResultCode reviewResultCode;
    private LocalDateTime reviewedAt;
    private String reviewerName;
    private Long regionId;
    private String url;

    // JPQL에서 사용될 생성자 (파라미터 순서/타입 일치 필수!)
    public AdMentorReportDTO(
        Long id,
        Long userId,
        String reporterName,
        ReportTargetType targetType,
        Long targetId,
        String targetTitle,
        String reasonCode,
        String reasonDescription,   
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
        this.reasonDescription = reasonDescription;  
        this.reasonDetail = reasonDetail;
        this.createdAt = createdAt;
        this.reviewResultCode = reviewResultCode;
        this.reviewedAt = reviewedAt;
        this.reviewerName = reviewerName;
        this.regionId = regionId;
        this.url = url;
    }
}
