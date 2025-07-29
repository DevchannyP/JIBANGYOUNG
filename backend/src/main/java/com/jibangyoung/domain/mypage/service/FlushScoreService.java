package com.jibangyoung.domain.mypage.service;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mypage.entity.UserRegionScore;
import com.jibangyoung.domain.mypage.entity.UserRegionScoreId;
import com.jibangyoung.domain.mypage.repository.UserRegionScoreRepository;
import com.jibangyoung.domain.mypage.support.RedisScoreHelper;

import lombok.RequiredArgsConstructor;

/**
 * Redis→DB 배치/동기화 서비스
 * - 10분/1시간 주기, 동시성/UPSERT/락 처리
 */
@Service
@RequiredArgsConstructor
public class FlushScoreService {

    private final RedisScoreHelper redisScoreHelper;
    private final UserRegionScoreRepository regionScoreRepo;

    @Transactional
    public void flushAllScoresToDb() {
        Map<Integer, Map<Long, Long>> allScores = redisScoreHelper.getAllRegionScores();
        for (Integer regionId : allScores.keySet()) {
            for (Map.Entry<Long, Long> entry : allScores.get(regionId).entrySet()) {
                Long userId = entry.getKey();
                Long score = entry.getValue();

                // UPSERT 처리: 존재 시 누적, 없으면 신규
                UserRegionScoreId id = new UserRegionScoreId(userId, regionId);
                UserRegionScore entity = regionScoreRepo.findById(id)
                        .orElse(new UserRegionScore(userId, regionId, 0L, LocalDateTime.now()));
                entity.addScore(score);
                regionScoreRepo.save(entity);
            }
        }
    }
}
