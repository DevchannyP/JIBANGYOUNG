package com.jibangyoung.domain.mypage.dto;

import com.jibangyoung.domain.mypage.entity.Post;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * [실무] 게시글 미리보기 DTO
 * - 프론트/ReactQuery와 1:1 매칭, 불필요 필드 배제
 */
@Builder
public record PostPreviewDto(
    Long id,
    String title,
    String region,
    LocalDateTime createdAt
) {
    public static PostPreviewDto from(Post post) {
        return PostPreviewDto.builder()
            .id(post.getId())
            .title(post.getTitle())
            .region(post.getRegion())
            .createdAt(post.getCreatedAt())
            .build();
    }
}
