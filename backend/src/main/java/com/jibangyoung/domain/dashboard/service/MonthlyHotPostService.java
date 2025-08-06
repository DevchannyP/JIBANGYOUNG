// src/main/java/com/jibangyoung/domain/dashboard/service/MonthlyHotPostService.java

package com.jibangyoung.domain.dashboard.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jibangyoung.domain.dashboard.dto.MonthlyHotPostDto;
import com.jibangyoung.domain.dashboard.entity.MonthlyHotPostProjection;
import com.jibangyoung.domain.dashboard.repository.MonthlyHotPostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MonthlyHotPostService {

    private final MonthlyHotPostRepository repository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_KEY = "dashboard:monthly-hot:top10";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    public List<MonthlyHotPostDto> getMonthlyHotTop10() {
        // 1. 캐시 확인
        String cached = redisTemplate.opsForValue().get(CACHE_KEY);
        if (cached != null) {
            try {
                return objectMapper.readValue(
                        cached,
                        new TypeReference<List<MonthlyHotPostDto>>() {
                        });
            } catch (Exception e) {
                // 캐시 파싱 실패 무시
            }
        }

        // 2. DB에서 조회 (한 달 전 ~ 현재)
        LocalDateTime since = LocalDateTime.now().minusMonths(1);
        List<MonthlyHotPostProjection> rows = repository.findMonthlyHotTop10Native(since);

        // 3. DTO 변환 + 순위 부여
        List<MonthlyHotPostDto> result = new ArrayList<>();
        int idx = 1;
        for (MonthlyHotPostProjection row : rows) {
            result.add(new MonthlyHotPostDto(
                    row.getId(),
                    String.format("%02d", idx++),
                    row.getTitle(),
                    row.getAuthor(),
                    row.getViews(),
                    row.getLikes(),
                    row.getRegionId(),
                    row.getRegionName()));
        }

        // 4. 캐싱
        try {
            redisTemplate.opsForValue().set(
                    CACHE_KEY,
                    objectMapper.writeValueAsString(result),
                    CACHE_TTL);
        } catch (Exception e) {
        }

        return result;
    }
}
