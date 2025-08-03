package com.jibangyoung.domain.community.controller;

import java.util.List;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.community.dto.*;
import com.jibangyoung.domain.community.service.PresignedUrlService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.jibangyoung.domain.community.service.CommunityService;
@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@Slf4j
public class CommunityController {

    private final CommunityService communityService;
    private final PresignedUrlService presignedUrlService;
    private String publicUrl;

    //지역 코드
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
            @RequestParam(defaultValue = "10") int size) {
        return communityService.getPostsByRegion(regionCode, page, size);
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

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(communityService.findCommentsByPostId(postId));
    }

    //댓글 작성
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Void> createComment(
            @PathVariable Long postId,
            @RequestBody CommentRequestDto requestDto
    ) {
        log.warn("댓글 작성 시 @AuthenticationPrincipal User 객체 사용 안 함. userId: {}, author: {}", requestDto.getUserId(), requestDto.getAuthor());
        communityService.saveComment(postId, requestDto.getUserId(), requestDto.getAuthor(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId
    ) {
        // 임시
        Long userId = 1L;
        communityService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
