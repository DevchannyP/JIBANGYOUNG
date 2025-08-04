package com.jibangyoung.domain.policy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.policy.entity.PolicyFavorite;

public interface PolicyFavoriteRepository extends JpaRepository<PolicyFavorite, Long> {
    List<PolicyFavorite> findAllByUserId(Long userId);

    Optional<PolicyFavorite> findByUserIdAndPolicyNo(Long userId, Long policyNo);

    void deleteByUserIdAndPolicyNo(Long userId, Long policyNo);
}
