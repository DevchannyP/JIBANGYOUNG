package com.jibangyoung.domain.mypage.entity;

import com.jibangyoung.domain.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "survey_favorite",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "survey_id"}),
    indexes = @Index(name = "idx_user_survey", columnList = "user_id,survey_id"))
public class SurveyFavorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 유저 연관
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 설문(외부 도메인) 식별자
    @Column(nullable = false)
    private Long surveyId;

    @Column(nullable = false, length = 100)
    private String title;

    private LocalDateTime participatedAt;

    @Column(nullable = false)
    private boolean isFavorite;

    @Builder
    public SurveyFavorite(User user, Long surveyId, String title, LocalDateTime participatedAt, boolean isFavorite) {
        this.user = user;
        this.surveyId = surveyId;
        this.title = title;
        this.participatedAt = participatedAt;
        this.isFavorite = isFavorite;
    }

    public void toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }
}
