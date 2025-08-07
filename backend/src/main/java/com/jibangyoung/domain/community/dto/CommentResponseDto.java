package com.jibangyoung.domain.community.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.jibangyoung.domain.mypage.entity.Comment;

import lombok.Getter;

@Getter
public class CommentResponseDto {
    private final Long id;
    private final String author;
    private final String content;
    private final LocalDateTime createdAt;
    private final Long parentId;
    private final boolean isDeleted;
    private final List<CommentResponseDto> replies;

    // 기본 생성자 (답글 없는 경우)
    public CommentResponseDto(Comment comment) {
        this(comment, List.of());
    }

    // 메인 생성자 (답글 포함)
    public CommentResponseDto(Comment comment, List<CommentResponseDto> replies) {
        this.id = comment.isDeleted() ? 0 : comment.getId();
        this.author = comment.getUser().getNickname();
        this.parentId = comment.getParent() != null ? comment.getParent().getId() : null;
        this.createdAt = comment.getCreatedAt();
        this.isDeleted = comment.isDeleted();
        this.content = comment.isDeleted() ? "삭제된 댓글입니다." : comment.getContent();
        this.replies = replies;
    }
}