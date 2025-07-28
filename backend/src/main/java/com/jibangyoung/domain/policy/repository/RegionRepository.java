package com.jibangyoung.domain.policy.repository;

import com.jibangyoung.domain.policy.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegionRepository extends JpaRepository<Region, Integer> {
    List<Region> findAllByOrderByRegionCode();
}
