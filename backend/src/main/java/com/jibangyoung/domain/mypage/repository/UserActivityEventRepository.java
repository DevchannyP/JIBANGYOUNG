package com.jibangyoung.domain.mypage.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jibangyoung.domain.mypage.entity.UserActivityEvent;

public interface UserActivityEventRepository extends JpaRepository<UserActivityEvent, Long> {

    // 기본 통계 프로젝션
    @Query("""
                SELECT
                    e.regionId AS regionId,
                    COUNT(CASE WHEN e.actionType = 'POST' THEN 1 END) AS postCount,
                    COUNT(CASE WHEN e.actionType = 'COMMENT' THEN 1 END) AS commentCount,
                    COUNT(CASE WHEN e.actionType = 'MENTORING' THEN 1 END) AS mentoringCount,
                    COALESCE(SUM(e.scoreDelta),0) AS score
                FROM UserActivityEvent e
                WHERE e.user.id = :userId AND e.regionId = :regionId
            """)
    RegionScoreStat findRegionScoreStat(Long userId, Long regionId);

    // 날짜별 점수 변동 히스토리 (최근 10건)
    @Query("""
                SELECT
                    DATE(e.createdAt) AS date,
                    SUM(e.scoreDelta) AS delta,
                    MAX(e.actionType) AS reason
                FROM UserActivityEvent e
                WHERE e.user.id = :userId AND e.regionId = :regionId
                GROUP BY DATE(e.createdAt)
                ORDER BY DATE(e.createdAt) DESC
            """)
    List<ScoreHistoryRow> findScoreHistory(Long userId, Long regionId);

    // regionId로 지역명 반환 (JOIN 필요시 region 테이블 연동)
    @Query("SELECT r.name FROM Region r WHERE r.id = :regionId")
    String findRegionName(Long regionId);

    // Projection Interfaces
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
