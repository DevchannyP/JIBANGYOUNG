package com.jibangyoung.domain.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.admin.dto.AdRegionDTO;
import com.jibangyoung.domain.policy.entity.Region;

@Repository
public interface AdRegionRepository extends JpaRepository<Region, Integer> {

    @Query("SELECT DISTINCT new com.jibangyoung.domain.admin.dto.AdRegionDTO(r.regionCode, r.sido) FROM Region r ORDER BY r.sido ASC")
    List<AdRegionDTO> findDistinctSidoList();
}
