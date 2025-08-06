package com.jibangyoung.domain.policy.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.policy.entity.PolicyFavorite;
import com.jibangyoung.domain.policy.repository.PolicyFavoriteRepository;
import com.jibangyoung.domain.policy.repository.PolicyRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyFavoriteService {

    private final PolicyFavoriteRepository policyFavoriteRepository;
    private final PolicyRepository policyRepository;

    @Transactional
    public void syncBookmarks(Long userId, List<Long> incomingPolicyIds) {
        // 1. DB에 저장된 현재 유저의 찜 목록
        List<PolicyFavorite> existingFavorites = policyFavoriteRepository.findAllByUserId(userId);
        Set<Long> existingPolicyIds = existingFavorites.stream()
                .map(PolicyFavorite::getPolicyNo)
                .collect(Collectors.toSet());

        Set<Long> incomingSet = new HashSet<>(incomingPolicyIds);

        // 2. 추가 대상 = 요청에는 있지만 기존에는 없는 것
        Set<Long> toAdd = new HashSet<>(incomingSet);
        toAdd.removeAll(existingPolicyIds);

        // 3. 삭제 대상 = 기존에는 있지만 요청에는 없는 것
        Set<Long> toRemove = new HashSet<>(existingPolicyIds);
        toRemove.removeAll(incomingSet);

        // 4. 추가 로직
        for (Long policyId : toAdd) {
            policyFavoriteRepository.save(PolicyFavorite.of(userId, policyId));
            // plcy_no 가져와서 해당 모든 rows의 favorites 증가
            policyRepository.incrementFavoritesByPlcyNo(policyId);
        }

        // 5. 삭제 로직
        for (Long policyId : toRemove) {
            policyFavoriteRepository.deleteByUserIdAndPolicyNo(userId, policyId);
            // plcy_no 가져와서 해당 모든 rows의 favorites 감소
            policyRepository.decrementFavoritesByPlcyNo(policyId);
        }
    }

    // 찜 정책 로그인시 로컬 스토리지에 전송
    public List<Long> findPolicyCodesByUserId(Long userId) {
        return policyFavoriteRepository.findPolicyCodesByUserId(userId);
    }
}
