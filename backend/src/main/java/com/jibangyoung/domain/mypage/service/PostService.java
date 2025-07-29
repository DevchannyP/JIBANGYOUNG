package com.jibangyoung.domain.mypage.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.mypage.dto.PostPreviewDto;
import com.jibangyoung.domain.mypage.entity.Post;
import com.jibangyoung.domain.mypage.repository.PostRepository;
import com.jibangyoung.global.exception.ErrorCode;
import com.jibangyoung.global.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

/**
 * [실무] 내 게시글 조회 서비스
 * - DB/Page/totalCount, CSR/ReactQuery에 최적화
 * - 타입/API 완전 일원화, 예외 일관성
 * - 페이징 확장성, 추후 검색/필터도 쉽게 적용
 */
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /**
     * 내 게시글 목록 페이징 (1-base)
     */
    @Transactional(readOnly = true)
    public PostListResponse getMyPosts(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "게시글 주인 사용자 없음"));

        Page<Post> postPage = postRepository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(page - 1, size));
        List<PostPreviewDto> posts = postPage.map(PostPreviewDto::from).getContent();
        long totalCount = postPage.getTotalElements();

        return new PostListResponse(posts, totalCount);
    }

    /**
     * [내부] CSR/ReactQuery에 최적화된 totalCount+posts DTO
     */
    public record PostListResponse(List<PostPreviewDto> posts, long totalCount) {
    }
}
