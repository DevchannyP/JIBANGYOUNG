package com.jibangyoung.domain.admin.controller;

import com.jibangyoung.domain.admin.dto.AdPostDTO;
import com.jibangyoung.domain.admin.service.AdPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
public class AdminPostController {

    private final AdPostService postService;

    // 게시글관리_조회
    @GetMapping
    public List<AdPostDTO> getAllPosts() {
        return postService.getAllPosts();
    }

    // 게시글관리_삭제
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }
}
