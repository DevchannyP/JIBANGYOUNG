// src/main/java/com/jibangyoung/domain/dashboard/entity/MonthlyHotPostProjection.java

package com.jibangyoung.domain.dashboard.entity;

/**
 * NativeQuery 결과 매핑 Projection
 */
public interface MonthlyHotPostProjection {
    Long getId();

    String getTitle();

    String getAuthor(); // 닉네임

    Integer getViews();

    Integer getLikes();

    Integer getRegionId(); // region_code

    String getRegionName(); // sido
}
