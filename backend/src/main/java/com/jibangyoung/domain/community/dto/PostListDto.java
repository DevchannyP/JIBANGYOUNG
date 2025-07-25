package com.jibangyoung.domain.community.dto;

import java.time.LocalDateTime;

import com.jibangyoung.domain.community.entity.Posts;
import com.jibangyoung.domain.community.support.RegionSidoMapper;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
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

    public static PostListDto from(Posts posts) {
        String regionName = RegionSidoMapper.getRegionName(posts.getRegionId());
        return PostListDto.builder()
                .id(posts.getId())
                .title(posts.getTitle())
                .category(posts.getCategory().name())
                .likes(posts.getLikes())
                .views(posts.getViews())
                .createdAt(posts.getCreatedAt())
                .userId(posts.getUserId())
                .regionId(posts.getRegionId())
                .regionName(regionName)
                .build();
    }
}
