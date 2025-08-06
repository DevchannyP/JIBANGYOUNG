package com.jibangyoung.domain.community.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.community.dto.CommentRequestDto;
import com.jibangyoung.domain.community.dto.CommentResponseDto;
import com.jibangyoung.domain.community.dto.PostCreateRequestDto;
import com.jibangyoung.domain.community.dto.PostDetailDto;
import com.jibangyoung.domain.community.dto.PostListDto;
import com.jibangyoung.domain.community.dto.PresignedUrlRequest;
import com.jibangyoung.domain.community.dto.PresignedUrlResponse;
import com.jibangyoung.domain.community.dto.RecommendationRequestDto;
import com.jibangyoung.domain.community.dto.RegionResponseDto;
import com.jibangyoung.domain.community.service.CommunityService;
import com.jibangyoung.domain.community.service.PresignedUrlService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@Slf4j
public class CommunityController {

    private final CommunityService communityService;
    private final PresignedUrlService presignedUrlService;
    private String publicUrl;

    // 지역 코드
    @GetMapping("/region")
    public List<RegionResponseDto> getRegionCodes() {
        return communityService.getAllRegionsBoard();
    }

    // period 인기순
    @GetMapping("/top-liked")
    public List<PostListDto> getTopLikedByPeriod(@RequestParam(defaultValue = "today") String period) {
        return communityService.getCachedTop10ByPeriod(period);
    }

    // 최신 인기글
    @GetMapping("/popular")
    public Page<PostListDto> getPopularPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return communityService.getPopularPostsPage(page, size);
    }

    // 지역 게시판
    @GetMapping("/region/{regionCode}")
    public Page<PostListDto> getPostsByRegion(
            @PathVariable String regionCode,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String searchType) {
        return communityService.getPostsByRegion(regionCode, page, size, category, search, searchType);
    }

    // 게시글 상세
    @GetMapping("/post/{postId}")
    public PostDetailDto getPostDetail(@PathVariable Long postId) {
        return communityService.getPostDetail(postId);
    }

    // s3 이미지
    @PostMapping("/presign")
    public PresignedUrlResponse getPresignedUrl(@RequestBody PresignedUrlRequest request) {
        String fileName = "temp/" + request.getFileName();
        String presignedUrl = presignedUrlService.generatePresignedUrl(fileName, request.getContentType());
        String publicUrl = presignedUrlService.getPublicUrl(fileName);

        return new PresignedUrlResponse(presignedUrl, publicUrl);
    }

    // 글작성
    @PostMapping("/write")
    @PreAuthorize("isAuthenticated()") // 로그인한 사용자만
    public void writePost(@RequestBody @Valid PostCreateRequestDto request) {
        communityService.write(request);
    }

    @GetMapping("/regionPopular/{regionCode}")
    public Page<PostListDto> getPostsByRegionPopular(
            @PathVariable String regionCode,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return communityService.getPostsByRegionPopular(regionCode, page, size);
    }

    // 후기 추천순
    @GetMapping("/popular/reviews")
    public List<PostListDto> getTopReviewPosts() {
        return communityService.getTopReviewPosts();
    }

    // 공지
    @GetMapping("/notices")
    public ResponseEntity<List<PostListDto>> getNotices() {
        return ResponseEntity.ok(communityService.getNotices());
    }

    // 댓글 가져오기
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(communityService.findCommentsByPostId(postId));
    }

    // 댓글 작성
    @PostMapping("/posts/{postId}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> createComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long postId,
            @RequestBody CommentRequestDto requestDto) {
        Long userId = user.getId(); // 👈 실제 로그인한 유저 사용
        String author = user.getUsername();
        log.info("댓글 작성, userId: {}, author: {}", userId, author);
        communityService.saveComment(postId, userId, author, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteComment(
            @AuthenticationPrincipal User user,
            @PathVariable Long commentId) {
        communityService.deleteComment(commentId, user.getId());
        return ResponseEntity.noContent().build();
    }

    // 게시글 추천
    @PostMapping("/post/{postId}/recommend")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> recommendPost(
            @PathVariable Long postId,
            @RequestBody @Valid RecommendationRequestDto requestDto,
            @AuthenticationPrincipal User user) {
        communityService.recommendPost(postId, user.getId(), requestDto.getType());
        return ResponseEntity.ok().build();
    }
}
