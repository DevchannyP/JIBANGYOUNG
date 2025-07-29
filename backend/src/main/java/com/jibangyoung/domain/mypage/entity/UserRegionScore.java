package com.jibangyoung.domain.mypage.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@IdClass(UserRegionScoreId.class)
@Table(name = "user_region_score")
public class UserRegionScore {
    @Id
    private Long userId;

    @Id
    private Integer regionId;

    @Column(nullable = false)
    private Long totalScore;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public UserRegionScore(Long userId, Integer regionId, Long totalScore, LocalDateTime updatedAt) {
        this.userId = userId;
        this.regionId = regionId;
        this.totalScore = totalScore;
        this.updatedAt = updatedAt == null ? LocalDateTime.now() : updatedAt;
    }

    public void addScore(long delta) {
        this.totalScore += delta;
        this.updatedAt = LocalDateTime.now();
    }

    public void setTotalScore(Long totalScore) {
        this.totalScore = totalScore;
        this.updatedAt = LocalDateTime.now();
    }
}
