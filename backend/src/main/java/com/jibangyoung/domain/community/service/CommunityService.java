package com.jibangyoung.domain.community.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jibangyoung.domain.community.dto.PostDetailDto;
import com.jibangyoung.domain.community.dto.PostListDto;
import com.jibangyoung.domain.community.entity.Posts;
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
                .map(PostListDto::from)
                .collect(Collectors.toList());
    }
    public List<PostListDto> getCachedTop10ByPeriod(String period) {
        String key = switch (period.toLowerCase()) {
            case "week" -> "top10WeeklyPosts";
            case "month" -> "top10MonthlyPosts";
            default -> "top10TodayPosts"; // 기본값
        };
        return getCachedPostList(key);
    }

    // Redis에 저장된 게시글 리스트를 가져와 PostListDto 리스트로 변환
    private List<PostListDto> getCachedPostList(String cacheKey) {
        Object raw = redisTemplate.opsForValue().get(cacheKey);
        if (raw == null) {
            return Collections.emptyList();
        }
        @SuppressWarnings("unchecked")
        List<Object> rawList = (List<Object>) raw;
        return rawList.stream()
                .map(item -> objectMapper.convertValue(item, PostListDto.class))
                .collect(Collectors.toList());
    }

    public Page<PostListDto> getPopularPostsPage(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Posts> postPage = postRepository.findPopularPosts(pageable);
        return postPage.map(PostListDto::from); // ✅ now it's correct
    }

    public Page<PostListDto> getPostsByRegion(String regionCode, int page, int size) {
        int pageIndex = page - 1; // PageRequest는 0-based
        Pageable pageable = PageRequest.of(pageIndex, size);
        Page<Posts> postPage = postRepository.findByRegionPrefix(regionCode, pageable);
        return postPage.map(PostListDto::from);
    }
    public PostDetailDto getPostDetail(Long postId) {
        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다."));
        System.out.println(post);
        return PostDetailDto.from(post);
    }
}