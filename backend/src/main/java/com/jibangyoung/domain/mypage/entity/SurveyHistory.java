package com.jibangyoung.domain.mypage.entity;

import com.jibangyoung.domain.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "survey_history",
       indexes = {@Index(name = "idx_user_participatedAt", columnList = "user_id, participatedAt"),
                  @Index(name = "idx_user_isFavorite_participatedAt", columnList = "user_id, isFavorite, participatedAt")})
public class SurveyHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false)
    private LocalDateTime participatedAt;

    @Column(length = 500)
    private String resultUrl;

    @Column(nullable = false)
    private boolean isFavorite;

    @Builder
    public SurveyHistory(User user, String title, LocalDateTime participatedAt, String resultUrl, boolean isFavorite) {
        this.user = user;
        this.title = title;
        this.participatedAt = participatedAt;
        this.resultUrl = resultUrl;
        this.isFavorite = isFavorite;
    }
}
