package com.jibangyoung.domain.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.admin.repository.AdMentorProfileRepository;
import com.jibangyoung.domain.admin.repository.AdUserMaxScore;
import com.jibangyoung.domain.admin.repository.AdUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdMentorPromotionService {
    private final AdMentorProfileRepository mentorProfileRepository;
    private final AdUserRepository userRepository;

    @Transactional
    public Result runPromotion() {
        // 200~400점(포함) → B
        List<Long> toBUserIds = mentorProfileRepository.findUsersForPromotionToB()
                .stream().map(AdUserMaxScore::getUserId).distinct().toList();

        // 401~600점(포함) → A
        List<Long> toAUserIds = mentorProfileRepository.findUsersForPromotionToA()
                .stream().map(AdUserMaxScore::getUserId).distinct().toList();

        int promotedToB = 0;
        int promotedToA = 0;

        if (!toBUserIds.isEmpty()) {
            // 현재 role 이 C 인 경우에만 B 로 승급 (멱등)
            promotedToB = userRepository.promoteCtoB(toBUserIds);
        }
        if (!toAUserIds.isEmpty()) {
            // 현재 role 이 B 인 경우에만 A 로 승급 (멱등)
            promotedToA = userRepository.promoteBtoA(toAUserIds);
        }

        return new Result(promotedToB, promotedToA);
    }

    @lombok.Value
    public static class Result {
        int promotedToB;
        int promotedToA;
    }
}
