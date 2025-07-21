package com.jibangyoung.domain.community.support;

import com.jibangyoung.domain.community.dto.PostListDto;
import com.jibangyoung.domain.community.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PostCacheScheduler {

    private final CommunityService communityService;
    private final RedisTemplate<String, Object> redisTemplate;

    // 인기글 주간, 일간 탑 10개 캐시에다 fixedRate 마다 저장
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void updateTopPostsCache() {
        List<PostListDto> topPostsWeek = communityService.getRecentTop10(LocalDateTime.now().minusWeeks(1));
        List<PostListDto> topPostsToday = communityService.getRecentTop10(LocalDateTime.now().minusDays(1));
        redisTemplate.opsForValue().set("top10WeeklyPosts", topPostsWeek);
        redisTemplate.opsForValue().set("top10TodayPosts", topPostsToday);
    }
}
