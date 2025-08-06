package com.jibangyoung.domain.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewPostDto {
    private Long id;
    private String no;
    private String title;
    private String author;
    private String content;
    private String regionName; // 프론트엔드와 호환을 위해 regionName 사용
    private Long regionId;
    private String thumbnailUrl;
    private Integer likes;
    private Integer views;
    private String createdAt;
    private String summary;
}