// "내 모든 지역별 점수" 패널용 (record 버전)
package com.jibangyoung.domain.mypage.dto;

/**
 * 내 모든 지역별 점수 조회용 DTO
 * - regionId: 지역 ID
 * - score: 해당 지역 누적 점수
 */
public record MyRegionScoreDto(int regionId, int score) {
    // 별도의 필드/생성자/메서드 필요 없음!
}
