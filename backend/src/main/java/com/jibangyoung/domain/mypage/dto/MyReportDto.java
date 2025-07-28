package com.jibangyoung.domain.mypage.dto;

// com.jibangyoung.domain.mypage.dto.MyReportDto.java
import java.time.LocalDateTime;

import com.jibangyoung.domain.mypage.entity.ReportTargetType;
import com.jibangyoung.domain.mypage.entity.ReviewResultCode;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "내 신고 이력 DTO")
public record MyReportDto(
        @Schema(description = "신고 ID") Long id,
        @Schema(description = "유저 ID") Long userId,
        @Schema(description = "신고 대상 타입") ReportTargetType targetType,
        @Schema(description = "신고 대상 PK") Long targetId,
        @Schema(description = "신고 사유 코드") String reasonCode,
        @Schema(description = "신고 상세 사유") String reasonDetail,
        @Schema(description = "신고 생성일") LocalDateTime createdAt,
        @Schema(description = "처리 결과 코드") ReviewResultCode reviewResultCode) {
}
