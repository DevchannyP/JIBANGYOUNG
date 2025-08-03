// dashboard/repository/RegionDashRepository.java
package com.jibangyoung.domain.dashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jibangyoung.domain.dashboard.entity.RegionDashEntity;

public interface RegionDashRepository extends JpaRepository<RegionDashEntity, Integer> {

    // “전국”, 빈 값 등은 제외!
    @Query("""
                SELECT DISTINCT r.sido FROM RegionDashEntity r
                WHERE r.sido IS NOT NULL AND r.sido <> ''
                AND r.sido NOT LIKE '%전국%'
                ORDER BY r.sido ASC
            """)
    List<String> findAllSidoDistinct();

    // 특정 시도의 하위 구/군만 리턴(빈값/null 제외, 정렬)
    @Query("""
                SELECT r FROM RegionDashEntity r
                WHERE r.sido = :sido AND r.guGun1 IS NOT NULL AND r.guGun1 <> ''
                ORDER BY r.guGun1 ASC
            """)
    List<RegionDashEntity> findBySidoOrderByGuGun1Asc(String sido);

}
