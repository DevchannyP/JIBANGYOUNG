// domain/dashboard/dto/ReviewPostDto.java
package com.jibangyoung.domain.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewPostDto {
    private Long id; // Posts.id
    private Long regionId; // Posts.regionId
    private String title; // Posts.title
    private String content; // 후기 본문 요약 (최대 110자)
    private String author; // User.nickname
    private String regionName; // Region.name
    private String thumbnailUrl; // 썸네일 (없으면 null)
}
