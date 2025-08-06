package com.jibangyoung.domain.admin.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "posts")
@SQLDelete(sql = "UPDATE posts SET is_deleted = true WHERE id = ?") // 삭제 시 실제로는 UPDATE 실행
public class AdminPosts {

    // 기본 식별자
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // 사용자 및 지역
    @Column(name = "user_id", nullable = false)
    private long userId;

    @Column(name = "region_id", nullable = false)
    private long regionId;

    // 게시글 카테고리
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    private PostCategory category;

    // 썸네일
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    // 콘텐츠 정보
    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "tag", length = 50)
    private String tag;

    // 게시글 메타 정보
    @Column(name = "likes", nullable = false)
    private int likes;

    @Column(name = "views", nullable = false)
    private int views;

    // 상태 정보
    @Column(name = "is_notice", nullable = false)
    private boolean isNotice;

    @Column(name = "is_mentor_only", nullable = false)
    private boolean isMentorOnly;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;

    // 시간 정보
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 자동 시간 처리
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void increaseViews() {
        this.views += 1;
    }

    public void incrementLikes() {
        this.likes += 1;
    }

    // 내부 enum으로 카테고리 정의
    @Getter
    public enum PostCategory {
        FREE("자유"),
        QUESTION("질문"),
        REVIEW("후기"),
        NOTICE("공지");

        private final String label;

        PostCategory(String label) {
            this.label = label;
        }
    }
    // 관리자_데시보드_신고게시글 복구
    public void setIsDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}