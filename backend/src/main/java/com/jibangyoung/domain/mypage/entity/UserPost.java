package com.jibangyoung.domain.mypage.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "user_post",
    indexes = {
        @Index(name = "idx_post_user", columnList = "user_id"),
        @Index(name = "idx_post_region", columnList = "region")
    }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserPost {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserProfile user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 30)
    private String region;

    @Column(length = 30)
    private String createdAt;
}
