package com.jibangyoung.domain.community.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.community.dto.PostListDto;
import com.jibangyoung.domain.community.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final PostRepository postRepository;

    public List<PostListDto> getRecentTop10(LocalDateTime since) {
        return postRepository.findTop10ByCreatedAtAfterOrderByLikesDesc(since).stream()
                .map(post -> new PostListDto(
                        post.getTitle(),
                        post.getLikes(),
                        post.getViews(),
                        post.getCreatedAt(),
                        post.getRegionId()))
                .collect(Collectors.toList());
    }
}