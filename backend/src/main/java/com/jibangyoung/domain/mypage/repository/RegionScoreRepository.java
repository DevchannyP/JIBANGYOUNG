package com.jibangyoung.domain.mypage.repository;

import com.jibangyoung.domain.mypage.entity.RegionScore;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegionScoreRepository extends JpaRepository<RegionScore, Long> {
    @EntityGraph(attributePaths = "scoreHistory")
    Optional<RegionScore> findByRegion(String region);
}
