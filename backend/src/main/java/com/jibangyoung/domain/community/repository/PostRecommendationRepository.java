package com.jibangyoung.domain.community.repository;

import com.jibangyoung.domain.community.entity.PostRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRecommendationRepository extends JpaRepository<PostRecommendation, Long> {
    Optional<PostRecommendation> findByUserIdAndPostId(Long userId, Long postId);
}
