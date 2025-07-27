package com.jibangyoung.domain.mypage.controller;

import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mypage.dto.AlertInfoDto;
import com.jibangyoung.domain.mypage.service.AlertQueryService;
import com.jibangyoung.domain.mypage.service.CommentService;
import com.jibangyoung.domain.mypage.service.PostService;
import com.jibangyoung.global.common.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * [마이페이지] API 컨트롤러
 * - CSR 최적화 (ReactQuery, Skeleton, 페이징 대응)
 * - 기능별 서비스 계층 위임
 */
@Tag(name = "마이페이지", description = "마이페이지 관련 API")
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final AlertQueryService alertQueryService;
    private final CommentService commentService;
    private final PostService postService;

    // --- [1] 관심 알림 조회 ---
    @Operation(summary = "관심지역 알림 목록 조회 (Slice 기반)")
    @GetMapping("/users/{userId}/alerts")
    public ApiResponse<Slice<AlertInfoDto>> getUserAlerts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(alertQueryService.getUserAlerts(userId, page, size));
    }

    // --- [2] 댓글 ---
    @Operation(summary = "내 댓글 목록 조회 (페이징)")
    @GetMapping("/users/{userId}/comments")
    public ApiResponse<?> getMyComments(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(commentService.getMyComments(userId, page, size));
    }

    @Operation(summary = "내 댓글 삭제")
    @DeleteMapping("/users/{userId}/comments/{commentId}")
    public ApiResponse<?> deleteMyComment(
            @PathVariable Long userId,
            @PathVariable Long commentId) {
        commentService.deleteMyComment(userId, commentId);
        return ApiResponse.success("ok");
    }

    // --- [3] 게시글 ---
    @Operation(summary = "내 게시글 목록 조회 (페이징)")
    @GetMapping("/users/{userId}/posts")
    public ApiResponse<PostService.PostListResponse> getMyPosts(
            @PathVariable long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(postService.getMyPosts(userId, page, size));
    }
}