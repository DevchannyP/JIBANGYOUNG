package com.jibangyoung.domain.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.admin.dto.AdPostDTO;
import com.jibangyoung.domain.admin.entity.AdminPosts;
import com.jibangyoung.domain.admin.repository.AdPostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdPostService {
    private final AdPostRepository adPostRepository;

    // 닉네임 포함 게시글 목록 조회
    public List<AdPostDTO> getAllPosts() {
        return adPostRepository.findAllPostWithNickname();
    }

    // 게시글 삭제
    @Transactional
    public void deletePost(Long postId) {
        AdminPosts post = adPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        post.setIsDeleted(true);
        adPostRepository.save(post); 
    }
    // 게시글 목구
    @Transactional
    public void restorePost(Long postId) {
        AdminPosts post = adPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        post.setIsDeleted(false);
        adPostRepository.save(post);
    }
}