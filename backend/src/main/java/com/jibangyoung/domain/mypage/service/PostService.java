package com.jibangyoung.domain.mypage.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mypage.dto.PostPreviewDto;
import com.jibangyoung.domain.mypage.entity.Post;
import com.jibangyoung.domain.mypage.repository.MyPostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final MyPostRepository postRepository;

    @Transactional(readOnly = true)
    public PostListResponse getMyPosts(long userId, int page, int size) {
        Page<Post> postPage = postRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(
                userId, PageRequest.of(page - 1, size));
        List<PostPreviewDto> posts = postPage.map(PostPreviewDto::from).getContent();
        long totalCount = postPage.getTotalElements();
        return new PostListResponse(posts, totalCount);
    }

    public record PostListResponse(List<PostPreviewDto> posts, long totalCount) {
    }
}
