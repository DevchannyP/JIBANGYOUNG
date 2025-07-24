package com.jibangyoung.domain.community.dto;

import com.jibangyoung.domain.community.entity.Post;
import com.jibangyoung.domain.community.support.RegionSidoMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDetailDto {

    private Long id;

    private String title;
    private String content;
    private String category;
    private String tag;

    // 작성자 및 지역 정보
    private Long userId;
    private Long regionId;
    private String regionName;

    // 메타 정보
    private int likes;
    private int views;

    // 상태 정보
    private boolean isNotice;
    private boolean isMentorOnly;
    private boolean isDeleted;

    // 시간 정보
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostDetailDto from(Post post) {
        return PostDetailDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .category(post.getCategory().name())
                .tag(post.getTag())
                .userId(post.getUserId())
                .regionId(post.getRegionId())
                .regionName(RegionSidoMapper.getRegionName(post.getRegionId()))
                .likes(post.getLikes())
                .views(post.getViews())
                .isNotice(post.isNotice())
                .isMentorOnly(post.isMentorOnly())
                .isDeleted(post.isDeleted())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
