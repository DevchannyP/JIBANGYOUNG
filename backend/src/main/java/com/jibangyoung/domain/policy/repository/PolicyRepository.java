package com.jibangyoung.domain.policy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jibangyoung.domain.policy.entity.Policy;

public interface PolicyRepository extends JpaRepository<Policy, Integer> {

    // plcy_no(정책번호)별로 가장 작은 no를 가진 한 건만 선택
    // 동일한 정책번호가 여러 지역코드로 중복된 경우 가장 먼저 저장된 한 건만 반환
    @Query("SELECT p FROM Policy p WHERE p.NO IN (" +
            "SELECT MIN(p2.NO) FROM Policy p2 GROUP BY p2.plcy_no)")
    List<Policy> findDistinctByPlcyNm();

    // 특정 NO로 정책 상세 조회 (List 반환)
    @Query("SELECT p FROM Policy p WHERE p.NO = :NO")
    List<Policy> findByNO(@Param("NO") Integer NO);

    // 상위 10개 정책 조회 (테스트용)
    @Query("SELECT p FROM Policy p ORDER BY p.NO ASC")
    List<Policy> findTop10Policies();

    // recommend된 정책들 불러오기
    @Query("SELECT p FROM Policy p WHERE p.NO = :policyCode")
    Policy findByPlcyNo(String policyCode);

    @Modifying
    @Query("UPDATE Policy p SET p.favorites = p.favorites + 1 WHERE p.plcy_no = (SELECT p2.plcy_no FROM Policy p2 WHERE p2.NO = :policyId)")
    void incrementFavoritesByPlcyNo(@Param("policyId") Long policyId);

    @Modifying
    @Query("UPDATE Policy p SET p.favorites = CASE WHEN p.favorites > 0 THEN p.favorites - 1 ELSE 0 END WHERE p.plcy_no = (SELECT p2.plcy_no FROM Policy p2 WHERE p2.NO = :policyId)")
    void decrementFavoritesByPlcyNo(@Param("policyId") Long policyId);
}