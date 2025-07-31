package com.jibangyoung.domain.mypage.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mypage.entity.UserRegionScore;
import com.jibangyoung.domain.mypage.repository.UserRegionScoreRepository;
import com.jibangyoung.domain.mypage.support.RedisScoreHelper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlushScoreService {

    private final RedisScoreHelper redisScoreHelper;
    private final UserRegionScoreRepository userRegionScoreRepository;

    /**
     * Redis의 전체 지역별 유저 점수를 MariaDB로 일괄 저장(Upsert)
     */
    @Transactional
    public void flushAllScoresToDB() {
        Map<Integer, Map<Long, Long>> allScores = redisScoreHelper.getAllRegionScores();
        allScores.forEach((regionId, userScoreMap) -> {
            userScoreMap.forEach((userId, score) -> {
                // 기존 엔티티 있으면 업데이트, 없으면 신규 생성
                UserRegionScore regionScore = userRegionScoreRepository
                        .findByUserIdAndRegionId(userId, regionId)
                        .orElseGet(() -> new UserRegionScore(userId, regionId, 0L, null));
                regionScore.setTotalScore(score); // 점수 덮어쓰기
                userRegionScoreRepository.save(regionScore);
            });
        });
    }
}
