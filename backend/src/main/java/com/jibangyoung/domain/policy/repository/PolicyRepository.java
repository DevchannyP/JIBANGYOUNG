package com.jibangyoung.domain.policy.repository;

import com.jibangyoung.domain.policy.entity.Policy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
public interface PolicyRepository extends JpaRepository<Policy, Integer> {

    
    // plcyNm(정책명)별로 가장 작은 no를 가진 한 건만 선택
    // 동일한 정책명이 여러 지역코드로 중복된 경우 가장 먼저 저장된 한 건만 반환
    @Query("SELECT p FROM Policy p WHERE p.NO IN (" +
            "SELECT MIN(p2.NO) FROM Policy p2 GROUP BY p2.plcy_nm)")
    List<Policy> findDistinctByPlcyNm();

}