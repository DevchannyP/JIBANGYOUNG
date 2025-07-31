package com.jibangyoung.domain.mypage.dto;

import java.time.LocalDateTime;

import com.jibangyoung.domain.mypage.entity.Comment;

public record CommentPreviewDto(
        Long id,
        String content,
        Long targetPostId,
        String targetPostTitle,
        LocalDateTime createdAt) {
    public static CommentPreviewDto from(Comment entity) {
        return new CommentPreviewDto(
                entity.getId(),
                entity.getContent(),
                entity.getTargetPostId(),
                entity.getTargetPostTitle(),
                entity.getCreatedAt());
    }
}
