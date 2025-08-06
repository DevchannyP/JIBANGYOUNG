package com.jibangyoung.domain.policy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jibangyoung.domain.policy.entity.PolicyFavorite;

import io.lettuce.core.dynamic.annotation.Param;

public interface PolicyFavoriteRepository extends JpaRepository<PolicyFavorite, Long> {
    List<PolicyFavorite> findAllByUserId(Long userId);

    Optional<PolicyFavorite> findByUserIdAndPolicyNo(Long userId, Long policyNo);

    void deleteByUserIdAndPolicyNo(Long userId, Long policyNo);

    @Query("SELECT pf.policyNo FROM PolicyFavorite pf WHERE pf.userId = :userId")
    List<Long> findPolicyCodesByUserId(@Param("userId") Long userId);
}
