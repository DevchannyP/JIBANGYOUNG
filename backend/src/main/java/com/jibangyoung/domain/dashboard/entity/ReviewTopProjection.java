package com.jibangyoung.domain.dashboard.entity;

import java.time.LocalDateTime;

/**
 * 인기 정착 후기 Projection 인터페이스
 * - 인터페이스 기반 프로젝션이 필요할 때 사용
 * - 엔티티 구조(Posts, User) 및 DTO와 필드/타입 일치
 * - 서비스/컨트롤러/캐시 계층과도 100% 정합성 보장
 */
public interface ReviewTopProjection {
    Long getId();

    String getTitle();

    String getAuthor(); // User.nickname

    String getContent();

    String getRegionName(); // 지역명 (별도 로직으로 처리)

    String getThumbnailUrl();

    Integer getLikes();

    Integer getViews();

    LocalDateTime getCreatedAt();

    Long getRegionId(); // Posts.regionId와 일치

    String getSummary(); // content 요약 (앞 60자 등)
}
