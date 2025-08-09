package com.jibangyoung.domain.mypage.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mypage.dto.AlertInfoDto;
import com.jibangyoung.domain.mypage.dto.CommentPreviewDto;
import com.jibangyoung.domain.mypage.dto.MyReportDto;
import com.jibangyoung.domain.mypage.service.AlertQueryService;
import com.jibangyoung.domain.mypage.service.CommentService;
import com.jibangyoung.domain.mypage.service.MyReportService;
import com.jibangyoung.domain.mypage.service.PostService;
import com.jibangyoung.global.common.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "마이페이지", description = "마이페이지 관련 API")
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final AlertQueryService alertQueryService;
    private final CommentService commentService;
    private final PostService postService;
    private final MyReportService myReportService;

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
    // ⭐️ 내 댓글 목록 조회 (서비스에서 이미 CommentPreviewDto 반환)
    @GetMapping("/users/{userId}")
    public Page<CommentPreviewDto> getMyComments(
            @PathVariable Long userId,
            Pageable pageable) {
        return commentService.getMyComments(userId, pageable);
    }

    // 내 댓글 소프트딜리트
    @DeleteMapping("/users/{userId}/{commentId}")
    public ResponseEntity<Void> deleteMyComment(
            @PathVariable Long userId,
            @PathVariable Long commentId) {
        commentService.deleteMyComment(userId, commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{userId}/all")
    public Page<CommentPreviewDto> getAllMyCommentsIncludeDeleted(
            @PathVariable Long userId,
            Pageable pageable) {
        return commentService.getAllMyCommentsIncludeDeleted(userId, pageable);
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

    @Operation(summary = "내 신고 이력 전체 조회", description = "로그인 사용자의 신고 이력(최신순) 목록을 반환합니다.")
    @GetMapping("/reports")
    public ResponseEntity<List<MyReportDto>> getMyReports(
            @RequestParam Long userId) {
        List<MyReportDto> reports = myReportService.getMyReports(userId);
        return ResponseEntity.ok(reports);
    }
}