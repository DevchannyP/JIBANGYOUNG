// domain/dashboard/service/PolicyHotRankService.java
package com.jibangyoung.domain.dashboard.service;

import java.time.Duration;
import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.jibangyoung.domain.dashboard.dto.PolicyHotRankDto;
import com.jibangyoung.domain.dashboard.repository.PolicyHotRankRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyHotRankService {

    private final PolicyHotRankRepository repository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String CACHE_KEY = "policyhot:top10";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    // DB → TOP 10 반환
    public List<PolicyHotRankDto> getPolicyHotTop10() {
        List<Object[]> raw = repository.findPolicyHotTop10Native();
        return raw.stream()
                .map(row -> new PolicyHotRankDto(
                        (String) row[0], // no
                        ((Number) row[1]).intValue(), // id
                        (String) row[2], // name
                        (String) row[3], // region
                        (String) row[4])) // value
                .toList();
    }

    // 캐시 저장 (JSON 직렬화)
    public void cachePolicyHotTop10() {
        List<PolicyHotRankDto> top10 = getPolicyHotTop10();
        redisTemplate.opsForValue().set(CACHE_KEY, top10, CACHE_TTL);
    }

    // 캐시 + DB fallback (역직렬화 안전)
    @SuppressWarnings("unchecked")
    public List<PolicyHotRankDto> getTop10FromCache() {
        Object cached = redisTemplate.opsForValue().get(CACHE_KEY);
        if (cached instanceof List<?> list && !list.isEmpty()) {
            if (list.get(0) instanceof PolicyHotRankDto) {
                return (List<PolicyHotRankDto>) list;
            } else if (list.get(0) instanceof java.util.Map map) {
                // ⭐ Map → DTO 변환 (id 필드 주의)
                return list.stream()
                        .map(item -> {
                            var m = (java.util.Map<?, ?>) item;
                            return new PolicyHotRankDto(
                                    String.valueOf(m.get("no")),
                                    Integer.parseInt(String.valueOf(m.get("id"))),
                                    String.valueOf(m.get("name")),
                                    String.valueOf(m.get("region")),
                                    String.valueOf(m.get("value")));
                        })
                        .toList();
            }
        }
        // 캐시 미스 or 역직렬화 실패 → DB fresh
        List<PolicyHotRankDto> fresh = getPolicyHotTop10();
        redisTemplate.opsForValue().set(CACHE_KEY, fresh, CACHE_TTL);
        return fresh;
    }
}
