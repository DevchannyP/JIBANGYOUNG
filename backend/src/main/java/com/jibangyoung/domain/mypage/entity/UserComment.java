package com.jibangyoung.domain.mypage.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "user_comment",
    indexes = { @Index(name = "idx_comment_user", columnList = "user_id") }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserComment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserProfile user;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(length = 200)
    private String targetPostTitle;

    @Column(length = 30)
    private String createdAt;
}
