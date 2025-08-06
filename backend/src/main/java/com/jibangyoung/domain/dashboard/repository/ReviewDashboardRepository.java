package com.jibangyoung.domain.dashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.community.entity.Posts;

@Repository
public interface ReviewDashboardRepository extends JpaRepository<Posts, Long> {

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY p.likes DESC, p.views DESC, p.created_at DESC) as rn,
                p.id,
                p.title,
                u.nickname as author,
                p.content,
                p.region_id as regionId,
                p.thumbnail_url as thumbnailUrl,
                p.likes,
                p.views,
                DATE_FORMAT(p.created_at, '%Y-%m-%dT%H:%i:%s') as createdAt,
                CASE
                    WHEN LENGTH(p.content) > 100
                    THEN CONCAT(LEFT(REGEXP_REPLACE(p.content, '<[^>]*>', ''), 100), '...')
                    ELSE REGEXP_REPLACE(p.content, '<[^>]*>', '')
                END as summary
            FROM posts p
            INNER JOIN users u ON p.user_id = u.id
            WHERE p.category = 'REVIEW'
            AND p.is_deleted = false
            AND p.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
            ORDER BY p.likes DESC, p.views DESC, p.created_at DESC
            LIMIT 3
            """, nativeQuery = true)
    List<Object[]> findTop3ReviewPosts();
}