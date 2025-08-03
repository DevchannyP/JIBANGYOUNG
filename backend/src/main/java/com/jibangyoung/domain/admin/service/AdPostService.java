package com.jibangyoung.domain.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.admin.dto.AdPostDTO;
import com.jibangyoung.domain.admin.repository.AdPostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdPostService {
    private final AdPostRepository adPostRepository;

    // ✅ 닉네임 포함 게시글 목록 조회
    public List<AdPostDTO> getAllPosts() {
        return adPostRepository.findAllPostWithNickname();
    }

    // 게시글 삭제
    public void deletePost(Long id) {
        adPostRepository.deleteById(id);
    }
}
