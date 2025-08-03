package com.jibangyoung.domain.community.support;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.jibangyoung.domain.community.dto.PostListDto;
import com.jibangyoung.domain.community.service.CommunityService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PostCacheScheduler {

    private final CommunityService communityService;
    private final RedisTemplate<String, Object> redisTemplate;

    // 인기글 주간, 일간 탑 10개 캐시에다 fixedRate 마다 저장
    @Scheduled(fixedRate = 5 * 60 * 1000) // 5분마다 실행
    public void updatePopularPostCache() {
        Map<String, LocalDateTime> periodMap = Map.of(
                "top10TodayPosts", LocalDateTime.now().minusDays(1),
                "top10WeeklyPosts", LocalDateTime.now().minusWeeks(1),
                "top10MonthlyPosts", LocalDateTime.now().minusMonths(1));
        periodMap.forEach((key, since) -> {
            List<PostListDto> posts = communityService.getRecentTop10(since);
            redisTemplate.opsForValue().set(key, posts);
        });

        List<PostListDto> topReviews = communityService.getTopReviews();
        redisTemplate.opsForValue().set("top10ReviewPosts", topReviews);
    }
}
