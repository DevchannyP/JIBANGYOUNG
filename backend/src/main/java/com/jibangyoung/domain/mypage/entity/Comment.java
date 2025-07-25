package com.jibangyoung.domain.mypage.entity;

import com.jibangyoung.domain.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * [실무] 마이페이지-내 댓글 엔티티
 * - Slice/Page 성능 위한 인덱스 최적화
 * - 확장: Soft delete, 게시글 연관, 신고 등 확장성 보장
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "comment", indexes = {
    @Index(name = "idx_user_createdAt", columnList = "user_id, createdAt")
})
public class Comment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(nullable = false)
    private Long targetPostId;

    @Column(nullable = false, length = 200)
    private String targetPostTitle;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Builder
    public Comment(User user, String content, Long targetPostId, String targetPostTitle) {
        this.user = user;
        this.content = content;
        this.targetPostId = targetPostId;
        this.targetPostTitle = targetPostTitle;
        this.createdAt = LocalDateTime.now();
    }
}
