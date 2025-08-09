package com.jibangyoung.domain.dashboard.service;

import java.time.Duration;
import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.jibangyoung.domain.dashboard.dto.RegionFavoriteRankDto;
import com.jibangyoung.domain.dashboard.repository.RegionFavoriteRankRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegionFavoriteRankService {

    private final RegionFavoriteRankRepository repository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String REDIS_KEY = "top10:region:favorites";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    /**
     * TOP 10 지역 조회 (캐시 우선, 실패시 DB 직접 조회)
     */
    public List<RegionFavoriteRankDto> getTop10RegionFavorites() {
        try {
            // 1. 캐시에서 먼저 조회 시도
            List<RegionFavoriteRankDto> cachedData = getTop10FromCache();
            if (cachedData != null && !cachedData.isEmpty()) {
                log.debug("캐시에서 TOP 10 지역 데이터 반환: {} 건", cachedData.size());
                return cachedData;
            }

            log.warn("캐시에서 데이터를 찾을 수 없음. DB에서 직접 조회합니다.");

        } catch (Exception e) {
            log.error("캐시 조회 중 오류 발생. DB에서 직접 조회합니다.", e);
        }

        // 2. 캐시 실패시 DB에서 직접 조회
        return getTop10RegionFavoritesFromDB();
    }

    /**
     * DB에서 직접 TOP 10 지역 조회
     */
    public List<RegionFavoriteRankDto> getTop10RegionFavoritesFromDB() {
        try {
            List<Object[]> raw = repository.findTopRegionByFavoritesNative();
            List<RegionFavoriteRankDto> all = raw.stream()
                    .map(row -> new RegionFavoriteRankDto(
                            ((Number) row[0]).intValue(), // regionCode
                            (String) row[1], // sido
                            (String) row[2], // guGun1
                            (String) row[3], // guGun2
                            ((Number) row[4]).longValue() // favoriteCount
                    ))
                    .toList();

            List<RegionFavoriteRankDto> result = all.size() > 10 ? all.subList(0, 10) : all;
            log.info("DB에서 TOP 10 지역 데이터 조회 완료: {} 건", result.size());

            // DB 조회 후 캐시에 저장 시도
            try {
                redisTemplate.opsForValue().set(REDIS_KEY, result, CACHE_TTL);
                log.debug("DB 조회 결과를 캐시에 저장했습니다.");
            } catch (Exception e) {
                log.warn("캐시 저장 중 오류 발생했지만 DB 데이터는 정상 반환됩니다.", e);
            }

            return result;

        } catch (Exception e) {
            log.error("DB에서 지역 데이터 조회 중 오류 발생", e);
            throw new RuntimeException("지역 데이터를 조회할 수 없습니다.", e);
        }
    }

    /**
     * 캐시 갱신 (스케줄러용)
     */
    public void cacheTop10RegionFavorites() {
        try {
            List<RegionFavoriteRankDto> top10 = getTop10RegionFavoritesFromDB();
            redisTemplate.opsForValue().set(REDIS_KEY, top10, CACHE_TTL);
            log.info("TOP 10 지역 캐시 갱신 완료: {} 건", top10.size());

        } catch (Exception e) {
            log.error("캐시 갱신 중 오류 발생", e);
            // 예외를 다시 던지지 않아 스케줄러가 계속 실행되도록 함
        }
    }

    /**
     * 캐시에서 조회
     */
    @SuppressWarnings("unchecked")
    public List<RegionFavoriteRankDto> getTop10FromCache() {
        try {
            return (List<RegionFavoriteRankDto>) redisTemplate.opsForValue().get(REDIS_KEY);
        } catch (Exception e) {
            log.warn("Redis 캐시 조회 중 오류 발생", e);
            return null;
        }
    }
}