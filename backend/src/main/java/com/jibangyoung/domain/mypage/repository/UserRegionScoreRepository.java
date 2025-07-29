package com.jibangyoung.domain.mypage.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.mypage.entity.UserRegionScore;
import com.jibangyoung.domain.mypage.entity.UserRegionScoreId;

public interface UserRegionScoreRepository extends JpaRepository<UserRegionScore, UserRegionScoreId> {
    List<UserRegionScore> findByUserId(Long userId);

    List<UserRegionScore> findByRegionIdOrderByTotalScoreDesc(Integer regionId);

    Optional<UserRegionScore> findByUserIdAndRegionId(Long userId, Integer regionId);
}
