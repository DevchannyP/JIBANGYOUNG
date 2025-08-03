// dashboard/service/ReviewTopService.java
package com.jibangyoung.domain.dashboard.service;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jibangyoung.domain.dashboard.dto.ReviewPostDto;
import com.jibangyoung.domain.dashboard.repository.ReviewTopRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewTopService {
    private final ReviewTopRepository reviewTopRepository;

    @Cacheable(value = "reviewTop3", cacheManager = "redisCacheManager", unless = "#result == null || #result.size() < 1")
    public List<ReviewPostDto> getTop3Reviews() {
        return reviewTopRepository.findTop3ReviewPosts();
    }
}
