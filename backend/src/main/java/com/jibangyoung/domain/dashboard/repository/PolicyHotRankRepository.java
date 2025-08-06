// domain/dashboard/repository/PolicyHotRankRepository.java
package com.jibangyoung.domain.dashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jibangyoung.domain.policy.entity.Policy;

public interface PolicyHotRankRepository extends JpaRepository<Policy, Integer> {

    @Query(value = """
                SELECT
                    LPAD(CAST(ROW_NUMBER() OVER (ORDER BY p.favorites DESC) AS CHAR), 2, '0') AS no,
                    p.NO AS id,
                    p.plcy_nm AS name,
                    r.sido AS region,
                    CAST(p.favorites AS CHAR) AS value
                FROM policies p
                JOIN region r ON p.zip_cd = CAST(r.region_code AS CHAR)
                WHERE p.favorites > 0
                ORDER BY p.favorites DESC
                LIMIT 10
            """, nativeQuery = true)
    List<Object[]> findPolicyHotTop10Native();
}
