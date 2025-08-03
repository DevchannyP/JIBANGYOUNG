// domain/dashboard/repository/ReviewTopRepositoryImpl.java
package com.jibangyoung.domain.dashboard.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.community.entity.Posts;
import com.jibangyoung.domain.dashboard.dto.ReviewPostDto;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class ReviewTopRepositoryImpl implements ReviewTopRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<ReviewPostDto> findTop3ReviewPosts() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        return em.createQuery("""
                SELECT new com.jibangyoung.domain.dashboard.dto.ReviewPostDto(
                    p.id,
                    p.regionId,
                    p.title,
                    SUBSTRING(p.content, 1, 110),
                    u.nickname,
                    r.name,
                    CASE WHEN p.thumbnailUrl IS NULL OR p.thumbnailUrl = '' THEN NULL ELSE p.thumbnailUrl END
                )
                FROM Posts p
                JOIN User u ON u.id = p.userId
                JOIN Region r ON r.id = p.regionId
                WHERE p.category = :reviewCategory
                  AND p.isDeleted = false
                  AND p.isMentorOnly = false
                  AND p.createdAt >= :since
                ORDER BY p.likes DESC, p.createdAt DESC
                """, ReviewPostDto.class)
                .setParameter("reviewCategory", Posts.PostCategory.REVIEW)
                .setParameter("since", oneMonthAgo)
                .setMaxResults(3)
                .getResultList();
    }
}
