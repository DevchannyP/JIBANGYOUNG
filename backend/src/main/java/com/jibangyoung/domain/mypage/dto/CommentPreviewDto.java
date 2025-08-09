package com.jibangyoung.domain.mypage.dto;

import java.time.LocalDateTime;

import com.jibangyoung.domain.mypage.entity.Comment;

public record CommentPreviewDto(
        Long id,
        String content,
        Long targetPostId,
        String targetPostTitle,
        LocalDateTime createdAt,
        Long regionId) { // regionId 추가 (Posts 엔티티의 regionId와 매칭)

    public static CommentPreviewDto from(Comment entity, Long regionId) {
        return new CommentPreviewDto(
                entity.getId(),
                entity.getContent(),
                entity.getTargetPostId(),
                entity.getTargetPostTitle(),
                entity.getCreatedAt(),
                regionId);
    }
}