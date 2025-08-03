package com.jibangyoung.domain.dashboard.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

/**
 * [Scheduler] 정책 찜 수 기준 인기 지역 TOP 10 캐시 자동 갱신
 * - 5분마다 DB→Redis로 최신화
 */
@Component
@RequiredArgsConstructor
public class RegionFavoriteRankCacheScheduler {

    private final RegionFavoriteRankService service;

    // 5분마다 갱신, TTL은 10분
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void refreshTop10RegionFavoritesCache() {
        service.cacheTop10RegionFavorites();
    }
}
