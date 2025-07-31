package com.jibangyoung.domain.community.dto;

import com.jibangyoung.domain.community.entity.Posts;
import com.jibangyoung.domain.community.support.RegionSidoMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionPopularDto {
    private Long id;

    private String title;

    private String category;

    // 조회수, 추천수
    private int likes;
    private int views;

    //작성 날짜
    private LocalDateTime createdAt;

    private Long userId;
    // 지역
    private Long regionId;
    private String regionName;

    // 썸네일
    private String thumbnailUrl;

    // 요약
    private String summary;

    public static RegionPopularDto from(Posts posts) {
        String regionName = RegionSidoMapper.getRegionName(posts.getRegionId());
        String summary = extractSummary(posts.getContent());
        return RegionPopularDto.builder()
                .id(posts.getId())
                .title(posts.getTitle())
                .category(posts.getCategory().name())
                .likes(posts.getLikes())
                .thumbnailUrl(posts.getThumbnailUrl())
                .views(posts.getViews())
                .createdAt(posts.getCreatedAt())
                .userId(posts.getUserId())
                .regionId(posts.getRegionId())
                .regionName(regionName)
                .summary(summary)
                .build();
    }
    // 요약 데이터
    private static String extractSummary(String content) {
        if (content == null) return "";
        // 이미지 태그 제거
        String noImg = content.replaceAll("<img[^>]*>", "");
        // HTML 태그 제거
        String plainText = noImg.replaceAll("<[^>]*>", "");
        // 글자 자르기
        return plainText.length() > 80 ? plainText.substring(0, 80) + "..." : plainText;
    }

}
