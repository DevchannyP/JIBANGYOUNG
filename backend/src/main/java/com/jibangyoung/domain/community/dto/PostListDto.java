package com.jibangyoung.domain.community.dto;

import java.time.LocalDateTime;

import com.jibangyoung.domain.community.entity.Post;
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

    public static PostListDto from(Post post) {
        String regionName = RegionSidoMapper.getRegionName(post.getRegionId());
        return PostListDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .category(post.getCategory().name())
                .likes(post.getLikes())
                .views(post.getViews())
                .createdAt(post.getCreatedAt())
                .userId(post.getUserId())
                .regionId(post.getRegionId())
                .regionName(regionName)
                .build();
    }
}
