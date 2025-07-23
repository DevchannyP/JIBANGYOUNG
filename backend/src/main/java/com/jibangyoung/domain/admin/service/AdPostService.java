package com.jibangyoung.domain.admin.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.admin.dto.AdPostDTO;
import com.jibangyoung.domain.admin.repository.AdPostRepository;
import com.jibangyoung.domain.community.entity.Post;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdPostService {
    private final AdPostRepository adPostRepository;
    // 게시글 관리_조회
    public List<AdPostDTO> getAllPosts() {
        return adPostRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    // 게시글 관리_삭제
    public void deletePost(Long id){
        adPostRepository.deleteById(id);
    }
    // DTO 생성
    private AdPostDTO toDTO(Post post) {
        return new AdPostDTO(
                post.getId(),
                post.getTitle(),
                post.getUserId(),
                post.getCreatedAt().toLocalDate(), 
                post.getRegionId(),
                post.getViews(),
                post.getLikes()
        );
    }
}
