package com.jibangyoung.domain.mentor.dto;

import java.time.LocalDateTime;

import com.jibangyoung.domain.mypage.entity.ReportTargetType;
import com.jibangyoung.domain.mypage.entity.ReviewResultCode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor //QueryDSL Tuple 매핑이나, Builder 사용 모두 대응
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
}
