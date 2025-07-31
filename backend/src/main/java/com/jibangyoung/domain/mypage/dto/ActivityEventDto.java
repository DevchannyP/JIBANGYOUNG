package com.jibangyoung.domain.mypage.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "사용자 행동 이벤트 기록 DTO")
public record ActivityEventDto(
        @Schema(description = "유저 ID") Long userId,
        @Schema(description = "지역 ID") int regionId,
        @Schema(description = "행동 타입") String actionType,
        @Schema(description = "참조 ID") Long refId,
        @Schema(description = "부모 참조 ID") Long parentRefId,
        @Schema(description = "행동 값") Integer actionValue,
        @Schema(description = "점수 증감") Integer scoreDelta,
        @Schema(description = "추가 메타 정보 (JSON)") String meta,
        @Schema(description = "IP 주소") String ipAddr,
        @Schema(description = "User-Agent") String userAgent,
        @Schema(description = "플랫폼") String platform,
        @Schema(description = "언어") String lang,
        @Schema(description = "상태") String status,
        @Schema(description = "관리자 메모") String memo,
        @Schema(description = "이벤트 발생일") LocalDateTime createdAt,
        @Schema(description = "이벤트 수정일") LocalDateTime updatedAt) {
}
