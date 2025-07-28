package com.jibangyoung.domain.community.service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.jibangyoung.domain.community.dto.PostCreateRequestDto;
import com.jibangyoung.domain.community.dto.RegionResponseDto;
import com.jibangyoung.domain.policy.entity.Region;
import com.jibangyoung.domain.policy.repository.RegionRepository;
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
    private final RegionRepository regionRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    // 지역 코드
    // 지역 시도
    // 지역 군구 - (없으면 시도)
    public List<RegionResponseDto> getAllRegionsBoard() {
        List<Region> regions = regionRepository.findAllByOrderByRegionCode();

        Map<String, Map<String, RegionResponseDto>> regionMap = new LinkedHashMap<>();

        for (Region region : regions) {
            String sido = region.getSido();
            String guGun1 = region.getGuGun1();

            String finalGuGun = (guGun1 == null || guGun1.trim().isEmpty()) ? sido : guGun1;

            regionMap.putIfAbsent(sido, new HashMap<>());
            Map<String, RegionResponseDto> guGunMap = regionMap.get(sido);

            RegionResponseDto dto = RegionResponseDto.builder()
                    .regionCode(region.getRegionCode())
                    .sido(sido)
                    .guGun(finalGuGun)
                    .build();

            if (guGunMap.containsKey(finalGuGun)) {
                RegionResponseDto existingDto = guGunMap.get(finalGuGun);
                if (region.getRegionCode() < existingDto.getRegionCode()) {
                    guGunMap.put(finalGuGun, dto);
                }
            } else {
                guGunMap.put(finalGuGun, dto);
            }
        }

        return regionMap.values().stream()
                .flatMap(guGunMap -> guGunMap.values().stream())
                .sorted(Comparator.comparing(RegionResponseDto::getRegionCode))
                .collect(Collectors.toList());
    }

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


    public void write(PostCreateRequestDto request) {
        String content = request.getContent();
        String thumbnailUrl  = "https://jibangyoung-s3.s3.ap-northeast-2.amazonaws.com/post-images/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7+2025-07-19+171305.png";
        if (content != null && !content.isBlank()) {
            Pattern pattern = Pattern.compile("<img[^>]+src=[\"']?([^\"'>]+)[\"']?");
            Matcher matcher = pattern.matcher(content);
            if (matcher.find()) {
                thumbnailUrl = matcher.group(1);
            }
        }
        Posts post = request.toEntity(thumbnailUrl);
        postRepository.save(post);
    }
}