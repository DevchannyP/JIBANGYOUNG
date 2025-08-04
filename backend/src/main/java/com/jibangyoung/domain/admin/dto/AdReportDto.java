package com.jibangyoung.domain.admin.dto;

import java.time.LocalDateTime;

import com.jibangyoung.domain.mypage.entity.Report;
import com.jibangyoung.domain.mypage.entity.ReportTargetType;
import com.jibangyoung.domain.mypage.entity.ReviewResultCode;

import lombok.Builder;

@Builder
public record AdReportDto(
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
    public static AdReportDto from(Report report, String reasonDescription) {
        return AdReportDto.builder()
            .id(report.getId())
            .userId(report.getUser() != null ? report.getUser().getId() : null)
            .reporterName(report.getUser() != null ? report.getUser().getNickname() : null)
            .targetType(report.getTargetType())
            .targetId(report.getTargetId())
            .targetTitle(null) // 쿼리/후처리로 세팅
            .reasonCode(report.getReasonCode())
            .reasonDescription(reasonDescription)
            .reasonDetail(report.getReasonDetail())
            .createdAt(report.getCreatedAt())
            .reviewResultCode(report.getReviewResultCode())
            .reviewedAt(report.getReviewedAt())
            .reviewerName(null)
            .regionId(null)
            .url(null)
            .build();
    }
}