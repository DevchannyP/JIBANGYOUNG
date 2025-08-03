// src/main/java/com/jibangyoung/domain/dashboard/repository/MonthlyHotPostRepository.java

package com.jibangyoung.domain.dashboard.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jibangyoung.domain.community.entity.Posts;
import com.jibangyoung.domain.dashboard.entity.MonthlyHotPostProjection;

public interface MonthlyHotPostRepository extends JpaRepository<Posts, Long> {

    /**
     * 월간 인기글 Top10 (실제 테이블 구조 기준)
     * - posts.user_id → users.id, posts.region_id → region.region_code
     * - region.sido = 지역명
     * - is_deleted = false만 대상
     */
    @Query(value = """
            SELECT
                p.id AS id,
                p.title AS title,
                u.nickname AS author,
                p.views AS views,
                p.likes AS likes,
                p.region_id AS regionId,
                r.sido AS regionName
            FROM posts p
            JOIN users u ON p.user_id = u.id
            JOIN region r ON p.region_id = r.region_code
            WHERE p.created_at >= :since
              AND p.is_deleted = false
            ORDER BY p.likes DESC, p.views DESC
            LIMIT 10
            """, nativeQuery = true)
    List<MonthlyHotPostProjection> findMonthlyHotTop10Native(@Param("since") LocalDateTime since);
}
