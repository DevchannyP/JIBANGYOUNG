package com.jibangyoung.domain.mypage.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_survey")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSurvey {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserProfile user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false)
    private boolean isFavorite;

    @Column(length = 70)
    private String resultUrl;

    @Column(length = 40)
    private String participatedAt;
}
