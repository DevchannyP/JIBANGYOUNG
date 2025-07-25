package com.jibangyoung.domain.mypage.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "region_score", indexes = {
    @Index(name = "idx_region", columnList = "region")
})
public class RegionScore {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50, unique = true)
    private String region;

    @Column(nullable = false) private int postCount;
    @Column(nullable = false) private int commentCount;
    @Column(nullable = false) private int mentoringCount;
    @Column(nullable = false) private int score;
    @Column(nullable = false) private float promotionProgress;
    @Column(nullable = false) private int daysToMentor;

    @OneToMany(mappedBy = "regionScore", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<RegionScoreHistory> scoreHistory;

    @Builder
    public RegionScore(String region, int postCount, int commentCount, int mentoringCount,
                       int score, float promotionProgress, int daysToMentor, List<RegionScoreHistory> scoreHistory) {
        this.region = region;
        this.postCount = postCount;
        this.commentCount = commentCount;
        this.mentoringCount = mentoringCount;
        this.score = score;
        this.promotionProgress = promotionProgress;
        this.daysToMentor = daysToMentor;
        this.scoreHistory = scoreHistory;
    }
}
