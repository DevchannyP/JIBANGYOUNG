package com.jibangyoung.domain.mypage.support;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.jibangyoung.domain.mypage.dto.MyRegionScoreDto;
import com.jibangyoung.domain.mypage.dto.RegionScoreRankingDto;

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

    // ✅ 지역별 랭킹(TOP-N) 조회 - 랭킹은 전용 DTO로 반환
    public List<RegionScoreRankingDto> getTopRank(Integer regionId, int size) {
        String zsetKey = "region:score:" + regionId;
        Set<org.springframework.data.redis.core.ZSetOperations.TypedTuple<Object>> topSet = redisTemplate.opsForZSet()
                .reverseRangeWithScores(zsetKey, 0, size - 1);
        if (topSet == null)
            return Collections.emptyList();

        return topSet.stream()
                .map(tuple -> new RegionScoreRankingDto(
                        Long.parseLong(tuple.getValue().toString()), // userId
                        tuple.getScore().intValue() // score
                ))
                .collect(Collectors.toList());
    }

    // 한 유저의 모든 지역별 점수 조회
    public List<MyRegionScoreDto> getUserRegionScores(Long userId) {
        String hashKey = "user:" + userId + ":region:scores";
        Map<Object, Object> all = redisTemplate.opsForHash().entries(hashKey);
        if (all == null)
            return Collections.emptyList();

        return all.entrySet().stream()
                .map(e -> new MyRegionScoreDto(
                        Integer.parseInt(e.getKey().toString()), // regionId
                        Integer.parseInt(e.getValue().toString()) // score
                ))
                .collect(Collectors.toList());
    }

    // [배치/통계용] 전체 지역별 유저 점수 Map
    public Map<Integer, Map<Long, Long>> getAllRegionScores() {
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
