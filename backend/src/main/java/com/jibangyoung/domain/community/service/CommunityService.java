package com.jibangyoung.domain.community.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.jibangyoung.domain.community.dto.PostListDto;
import com.jibangyoung.domain.community.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final PostRepository postRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    // 최근 since 시점 이후(createdAt > since) 에 작성된 게시글 중,
    // 좋아요(likes) 수 기준 상위 10개를 내림차순으로 조회한다.
    public List<PostListDto> getRecentTop10(LocalDateTime since) {
        return postRepository.findTop10ByCreatedAtAfterOrderByLikesDesc(since).stream()
                .map(post -> new PostListDto(
                        post.getId(),
                        post.getTitle(),
                        post.getLikes(),
                        post.getViews(),
                        post.getCreatedAt(),
                        post.getUserId(),
                        post.getRegionId()))
                .collect(Collectors.toList());
    }
    //
    public List<PostListDto> getCachedWeekTop10() {
        Object raw = redisTemplate.opsForValue().get("top10WeeklyPosts");
        if (raw == null) {
            return Collections.emptyList();
        }

        @SuppressWarnings("unchecked")
        List<Object> rawList = (List<Object>) raw;

        return rawList.stream()
                .map(item -> objectMapper.convertValue(item, PostListDto.class))
                .collect(Collectors.toList());
    }
    public List<PostListDto> getCachedTodayTop10() {
        Object raw = redisTemplate.opsForValue().get("top10TodayPosts");
        if (raw == null) {
            return Collections.emptyList();
        }

        @SuppressWarnings("unchecked")
        List<Object> rawList = (List<Object>) raw;

        return rawList.stream()
                .map(item -> objectMapper.convertValue(item, PostListDto.class))
                .collect(Collectors.toList());
    }
}