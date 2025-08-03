package com.jibangyoung.domain.community.dto;

import com.jibangyoung.domain.mypage.entity.Comment;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class CommentResponseDto {
    private final Long id;
    private final String author;
    private final String content;
    private final LocalDateTime createdAt;
    private final Long parentId;
    private final boolean isDeleted;
    private final List<CommentResponseDto> replies;

    public CommentResponseDto(Comment comment) {
        this.id = comment.getId();
        this.author = comment.getUser().getNickname();
        this.parentId = comment.getParent() != null ? comment.getParent().getId() : null;
        this.createdAt = comment.getCreatedAt();
        this.isDeleted = comment.isDeleted();

        if (comment.isDeleted()) {
            this.content = "삭제된 댓글입니다.";
            this.replies = List.of(); //
        } else {
            this.content = comment.getContent();
            this.replies = List.of(); //
        }
    }

    public CommentResponseDto(Comment comment, List<CommentResponseDto> replies) {
        this.id = comment.getId();
        this.author = comment.getUser().getNickname();
        this.parentId = comment.getParent() != null ? comment.getParent().getId() : null;
        this.createdAt = comment.getCreatedAt();
        this.isDeleted = comment.isDeleted();
        this.content = comment.isDeleted() ? "삭제된 댓글입니다." : comment.getContent();
        this.replies = replies;
    }
}