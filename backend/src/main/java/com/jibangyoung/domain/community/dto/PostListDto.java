package com.jibangyoung.domain.community.dto;

import java.time.LocalDateTime;

import com.jibangyoung.domain.community.entity.Posts;
import com.jibangyoung.domain.community.support.RegionSidoMapper;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostListDto {
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
    
    // 공지사항 여부
    private boolean isNotice;

    public static PostListDto from(Posts posts) {
        String regionName = RegionSidoMapper.getRegionName(posts.getRegionId());
        String summary = extractSummary(posts.getContent());
        return PostListDto.builder()
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
                .isNotice(posts.isNotice())
                .build();
    }
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
