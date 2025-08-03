package com.jibangyoung.domain.dashboard.service;

import java.time.Duration;
import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.jibangyoung.domain.dashboard.dto.RegionFavoriteRankDto;
import com.jibangyoung.domain.dashboard.repository.RegionFavoriteRankRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegionFavoriteRankService {

    private final RegionFavoriteRankRepository repository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String REDIS_KEY = "top10:region:favorites";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    public List<RegionFavoriteRankDto> getTop10RegionFavorites() {
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
        return all.size() > 10 ? all.subList(0, 10) : all;
    }

    public void cacheTop10RegionFavorites() {
        List<RegionFavoriteRankDto> top10 = getTop10RegionFavorites();
        redisTemplate.opsForValue().set(REDIS_KEY, top10, CACHE_TTL);
    }

    @SuppressWarnings("unchecked")
    public List<RegionFavoriteRankDto> getTop10FromCache() {
        return (List<RegionFavoriteRankDto>) redisTemplate.opsForValue().get(REDIS_KEY);
    }
}
