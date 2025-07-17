package com.jibangyoung.domain.policy.repository;

import com.jibangyoung.domain.policy.entity.PolicyView;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Query;


public interface PolicyRepository extends JpaRepository<PolicyView, Integer> {
    // @Query(value = "SELECT NO, plcyNm FROM policies_view LIMIT 10", nativeQuery = true)
    // List<Object[]> findTop10PoliciesNative();
    
    @Query(value = "SELECT NO, plcyNm FROM policies_view", nativeQuery = true)
    List<Object[]> findNoPlcyNm();

}