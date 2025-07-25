package com.jibangyoung.domain.mypage.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "region_score_history", indexes = {
    @Index(name = "idx_region_score", columnList = "region_score_id")
})
public class RegionScoreHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_score_id", nullable = false)
    private RegionScore regionScore;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private int delta;

    @Column(length = 200)
    private String reason;

    @Builder
    public RegionScoreHistory(RegionScore regionScore, LocalDate date, int delta, String reason) {
        this.regionScore = regionScore;
        this.date = date;
        this.delta = delta;
        this.reason = reason;
    }
}
