package com.jibangyoung.domain.dashboard.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * [Scheduler] 정책 찜 수 기준 인기 지역 TOP 10 캐시 자동 갱신
 * - 5분마다 DB→Redis로 최신화
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RegionFavoriteRankCacheScheduler {

    private final RegionFavoriteRankService service;

    /**
     * 5분마다 갱신, TTL은 10분
     * 예외 발생해도 스케줄러는 계속 실행됨
     */
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void refreshTop10RegionFavoritesCache() {
        try {
            log.debug("TOP 10 지역 캐시 갱신 스케줄러 시작");
            service.cacheTop10RegionFavorites();
            log.debug("TOP 10 지역 캐시 갱신 스케줄러 완료");

        } catch (Exception e) {
            log.error("TOP 10 지역 캐시 갱신 스케줄러에서 예외 발생. 다음 스케줄에서 재시도됩니다.", e);
            // 예외를 잡아서 스케줄러가 중단되지 않도록 함
        }
    }
}