package com.jibangyoung.domain.mypage.dto;

import com.jibangyoung.domain.mypage.entity.Comment;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * [실무] 내 댓글 미리보기 DTO (프론트 구조/필드와 1:1)
 * - 타입/API 완전 일원화
 */
@Builder
public record CommentPreviewDto(
    Long id,
    String content,
    Long targetPostId,
    String targetPostTitle,
    LocalDateTime createdAt
) {
    public static CommentPreviewDto from(Comment c) {
        return CommentPreviewDto.builder()
            .id(c.getId())
            .content(c.getContent())
            .targetPostId(c.getTargetPostId())
            .targetPostTitle(c.getTargetPostTitle())
            .createdAt(c.getCreatedAt())
            .build();
    }
}
