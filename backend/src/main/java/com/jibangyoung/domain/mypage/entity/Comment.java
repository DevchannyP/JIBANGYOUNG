package com.jibangyoung.domain.mypage.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;

import com.jibangyoung.domain.auth.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "comment", indexes = {
        @Index(name = "idx_user_createdAt", columnList = "user_id, created_at")
})
@SQLDelete(sql = "UPDATE comment SET is_deleted = true, updated_at = NOW() WHERE id = ?")
// ✅ @Where(clause = "is_deleted = false") 제거
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(name = "target_post_id", nullable = false)
    private Long targetPostId;

    @Column(name = "target_post_title", nullable = false, length = 200)
    private String targetPostTitle;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;

    @Builder
    public Comment(User user, String content, Long targetPostId,
            String targetPostTitle, Comment parent) {
        this.user = user;
        this.content = content;
        this.targetPostId = targetPostId;
        this.targetPostTitle = targetPostTitle;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        this.parent = parent;
    }

    /** 소프트 삭제 */
    public void softDelete() {
        if (!isDeleted) {
            this.isDeleted = true;
            this.updatedAt = LocalDateTime.now();
        }
    }

    public void updateContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }

    // 관리자_데시보드_신고댓글 복구
    public void setIsDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
        this.updatedAt = LocalDateTime.now();
    }
}