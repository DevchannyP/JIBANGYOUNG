package com.jibangyoung.domain.mypage.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.mypage.dto.MyRegionScoreDto;
import com.jibangyoung.domain.mypage.dto.RegionScoreDto;
import com.jibangyoung.domain.mypage.repository.UserActivityEventRepository;
import com.jibangyoung.domain.mypage.support.RedisScoreHelper;

@Service
public class RegionScoreService {

    private final RedisScoreHelper redisScoreHelper;
    private final UserActivityEventRepository eventRepository;

    public RegionScoreService(RedisScoreHelper redisScoreHelper, UserActivityEventRepository eventRepository) {
        this.redisScoreHelper = redisScoreHelper;
        this.eventRepository = eventRepository;
    }

    // 지역 점수 상세 조회 (RegionScoreDto에 정확히 맞춰 반환)
    public RegionScoreDto getRegionScore(Long userId, int regionId, String regionName) {
        // 1. Redis에서 score 조회
        int score = redisScoreHelper.getUserRegionScores(userId).stream()
                .filter(s -> s.regionId() == regionId)
                .mapToInt(MyRegionScoreDto::score)
                .findFirst()
                .orElse(0);

        // 2. JPA에서 활동 이력 조회 (ScoreHistoryItem의 date는 String 타입이어야 함)
        List<RegionScoreDto.ScoreHistoryItem> history = eventRepository
                .findTop30ByUserIdAndRegionIdOrderByCreatedAtDesc(userId, regionId)
                .stream()
                .map(ev -> new RegionScoreDto.ScoreHistoryItem(
                        ev.getCreatedAt() != null ? ev.getCreatedAt().toLocalDate().toString() : null, // date
                        ev.getScoreDelta() == null ? 0 : ev.getScoreDelta(), // delta
                        ev.getActionType() == null ? "" : ev.getActionType() // reason
                ))
                .collect(Collectors.toList());

        // 실제 postCount, commentCount, mentoringCount는 쿼리 필요. (예시: 0)
        int postCount = 0;
        int commentCount = 0;
        int mentoringCount = 0;

        // promotionProgress, daysToMentor는 추가 비즈니스 로직 필요 (예시: 0)
        double promotionProgress = 0.0;
        int daysToMentor = 0;

        return new RegionScoreDto(
                regionId,
                regionName,
                postCount,
                commentCount,
                mentoringCount,
                score,
                promotionProgress,
                daysToMentor,
                history);
    }
}
