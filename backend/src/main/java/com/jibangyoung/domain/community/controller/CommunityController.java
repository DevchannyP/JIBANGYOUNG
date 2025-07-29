package com.jibangyoung.domain.community.controller;

import java.util.List;

import com.jibangyoung.domain.community.dto.*;
import com.jibangyoung.domain.community.service.PresignedUrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jibangyoung.domain.community.service.CommunityService;
@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;
    private final PresignedUrlService presignedUrlService;
    private String publicUrl;

    @GetMapping("/region")
    public List<RegionResponseDto> getRegionCodes() {
        return communityService.getAllRegionsBoard();
    }

    @GetMapping("/top-liked")
    public List<PostListDto> getTopLikedByPeriod(@RequestParam(defaultValue = "today") String period) {
        return communityService.getCachedTop10ByPeriod(period);
    }
    @GetMapping("/popular")
    public Page<PostListDto> getPopularPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return communityService.getPopularPostsPage(page, size);
    }
    @GetMapping("/region/{regionCode}")
    public Page<PostListDto> getPostsByRegion(
            @PathVariable String regionCode,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return communityService.getPostsByRegion(regionCode, page, size);
    }
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
    @PostMapping("/write")
    public void writePost(@RequestBody PostCreateRequestDto request) {
        communityService.write(request);
    }
}
