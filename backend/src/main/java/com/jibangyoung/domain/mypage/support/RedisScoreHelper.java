package com.jibangyoung.domain.mypage.support;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.jibangyoung.domain.mypage.dto.MyRegionScoreDto;
import com.jibangyoung.domain.mypage.dto.RegionScoreDto;

/**
 * Redis 점수 누적/랭킹 관리 Helper
 * - ZSET: region:score:{regionId} (userId→score)
 * - HASH: user:{userId}:region:scores (regionId→score)
 */
@Component
public class RedisScoreHelper {

    private final RedisTemplate<String, Object> redisTemplate;

    public RedisScoreHelper(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // 점수 증가
    public void incrementScore(Long userId, Integer regionId, Integer scoreDelta) {
        String zsetKey = "region:score:" + regionId;
        String hashKey = "user:" + userId + ":region:scores";
        redisTemplate.opsForZSet().incrementScore(zsetKey, userId.toString(), scoreDelta);
        redisTemplate.opsForHash().increment(hashKey, regionId.toString(), scoreDelta);
    }

    // 지역별 TOP-N 랭킹
    public List<RegionScoreDto> getTopRank(Integer regionId, int size) {
        String zsetKey = "region:score:" + regionId;
        Set<org.springframework.data.redis.core.ZSetOperations.TypedTuple<Object>> topSet = redisTemplate.opsForZSet()
                .reverseRangeWithScores(zsetKey, 0, size - 1);
        if (topSet == null)
            return List.of();
        return topSet.stream()
                .map(tuple -> new RegionScoreDto(Long.parseLong(tuple.getValue().toString()),
                        tuple.getScore().intValue()))
                .collect(Collectors.toList());
    }

    // 내 지역별 점수 모두 조회
    public List<MyRegionScoreDto> getUserRegionScores(Long userId) {
        String hashKey = "user:" + userId + ":region:scores";
        Map<Object, Object> all = redisTemplate.opsForHash().entries(hashKey);
        if (all == null)
            return List.of();
        return all.entrySet().stream()
                .map(e -> new MyRegionScoreDto(Integer.parseInt(e.getKey().toString()),
                        Integer.parseInt(e.getValue().toString())))
                .collect(Collectors.toList());
    }

    // 모든 지역별 전체 유저 점수 Map (배치용)
    public Map<Integer, Map<Long, Long>> getAllRegionScores() {
        // 실제 운영에서는 scan/keys 대신 별도 집계 테이블, Redis SCAN 활용 권장
        // 여기는 예시: region:score:* 모두 순회
        Map<Integer, Map<Long, Long>> result = new HashMap<>();
        Set<String> regionKeys = redisTemplate.keys("region:score:*");
        if (regionKeys != null) {
            for (String zsetKey : regionKeys) {
                String regionIdStr = zsetKey.substring(zsetKey.lastIndexOf(":") + 1);
                Integer regionId = Integer.parseInt(regionIdStr);
                Set<org.springframework.data.redis.core.ZSetOperations.TypedTuple<Object>> all = redisTemplate
                        .opsForZSet().rangeWithScores(zsetKey, 0, -1);
                if (all == null)
                    continue;
                Map<Long, Long> userScoreMap = all.stream()
                        .collect(Collectors.toMap(
                                t -> Long.parseLong(t.getValue().toString()),
                                t -> t.getScore().longValue()));
                result.put(regionId, userScoreMap);
            }
        }
        return result;
    }
}
