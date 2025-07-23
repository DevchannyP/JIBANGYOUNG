package com.jibangyoung.domain.mypage.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "user_alert",
    indexes = {
        @Index(name = "idx_alert_user", columnList = "user_id"),
        @Index(name = "idx_alert_region", columnList = "region")
    }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserAlert {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserProfile user;

    @Column(length = 30)
    private String region;

    @Column(nullable = false, length = 200)
    private String message;

    @Column(length = 30)
    private String createdAt;

    @Column(nullable = false)
    private boolean isRead;
}
