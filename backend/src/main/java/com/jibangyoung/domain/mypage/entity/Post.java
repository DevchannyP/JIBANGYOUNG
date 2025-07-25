package com.jibangyoung.domain.mypage.entity;

import com.jibangyoung.domain.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * [실무형 게시글 엔티티]
 * - 마이페이지 전용 Projection/최적화 인덱스
 * - SoftDelete, 게시글 카테고리, 지역명 등 확장 고려
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "post", indexes = {
    @Index(name = "idx_user_createdAt", columnList = "user_id, createdAt"),
    @Index(name = "idx_region", columnList = "region")
})
public class Post {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 50)
    private String region;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 추후 SoftDelete, status, etc. 확장 가능

    @Builder
    public Post(User user, String title, String region) {
        this.user = user;
        this.title = title;
        this.region = region;
        this.createdAt = LocalDateTime.now();
    }
}
