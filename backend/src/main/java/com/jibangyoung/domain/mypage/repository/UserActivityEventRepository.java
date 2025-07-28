package com.jibangyoung.domain.mypage.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jibangyoung.domain.mypage.entity.UserActivityEvent;

public interface UserActivityEventRepository extends JpaRepository<UserActivityEvent, Long> {

    // [1] 기본 통계
    @Query("""
                SELECT
                    e.region.regionCode AS regionId,
                    COUNT(CASE WHEN e.actionType = 'POST' THEN 1 END) AS postCount,
                    COUNT(CASE WHEN e.actionType = 'COMMENT' THEN 1 END) AS commentCount,
                    COUNT(CASE WHEN e.actionType = 'MENTORING' THEN 1 END) AS mentoringCount,
                    COALESCE(SUM(e.scoreDelta), 0) AS score
                FROM UserActivityEvent e
                WHERE e.user.id = :userId AND e.region.regionCode = :regionId
            """)
    RegionScoreStat findRegionScoreStat(@Param("userId") Long userId, @Param("regionId") Long regionId);

    // [2] 점수 히스토리
    @Query("""
                SELECT
                    DATE(e.createdAt) AS date,
                    SUM(e.scoreDelta) AS delta,
                    MAX(e.actionType) AS reason
                FROM UserActivityEvent e
                WHERE e.user.id = :userId AND e.region.regionCode = :regionId
                GROUP BY DATE(e.createdAt)
                ORDER BY DATE(e.createdAt) DESC
            """)
    List<ScoreHistoryRow> findScoreHistory(@Param("userId") Long userId, @Param("regionId") Long regionId);

    // [3] 지역 이름
    @Query("""
                SELECT r.sido
                FROM Region r
                WHERE r.regionCode = :regionId
            """)
    String findRegionName(@Param("regionId") Long regionId);

    // Projection
    interface RegionScoreStat {
        Long getRegionId();

        Integer getPostCount();

        Integer getCommentCount();

        Integer getMentoringCount();

        Integer getScore();
    }

    interface ScoreHistoryRow {
        LocalDate getDate();

        Integer getDelta();

        String getReason();
    }
}
