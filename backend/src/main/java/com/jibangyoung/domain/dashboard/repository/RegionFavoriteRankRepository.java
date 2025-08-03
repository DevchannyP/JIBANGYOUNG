package com.jibangyoung.domain.dashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jibangyoung.domain.policy.entity.Policy;

/**
 * [Repository] 정책 찜 수 기준 인기 지역 TOP N (Native Query)
 * - zip_cd(String) <-> region_code(Integer) 타입이 다를 때 ONLY 네이티브 쿼리 사용
 * - 시도, 구군 단위로 랭킹을 내려면 gu_gun_1, gu_gun_2도 group by에 포함
 */
public interface RegionFavoriteRankRepository extends JpaRepository<Policy, Integer> {

    @Query(value = """
                SELECT
                    r.region_code AS regionCode,
                    r.sido AS sido,
                    r.gu_gun_1 AS guGun1,
                    r.gu_gun_2 AS guGun2,
                    SUM(p.favorites) AS favoriteCount
                FROM policies p
                JOIN region r ON p.zip_cd = CAST(r.region_code AS CHAR)
                GROUP BY r.region_code, r.sido, r.gu_gun_1, r.gu_gun_2
                ORDER BY favoriteCount DESC
                LIMIT 10
            """, nativeQuery = true)
    List<Object[]> findTopRegionByFavoritesNative();

}
