package com.jibangyoung.domain.mypage.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mypage.dto.AlertDto;
import com.jibangyoung.domain.mypage.dto.CommentPreviewDto;
import com.jibangyoung.domain.mypage.dto.PostPreviewDto;
import com.jibangyoung.domain.mypage.dto.ReportDto;
import com.jibangyoung.domain.mypage.dto.UserProfileDto;
import com.jibangyoung.domain.mypage.dto.UserSurveyDto;
import com.jibangyoung.domain.mypage.entity.UserProfile;
import com.jibangyoung.domain.mypage.exception.MyPageException;
import com.jibangyoung.domain.mypage.repository.UserProfileRepository;
import com.jibangyoung.domain.mypage.service.MyPageService;
import com.jibangyoung.global.common.ApiResponse; // ✅ 주의: 공통 래퍼 import!

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;
    private final UserProfileRepository userProfileRepository;

    // 1. 내 프로필 조회
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> getMyProfile(Principal principal) {
        String username = principal.getName();
        UserProfileDto dto = myPageService.getUserProfile(username);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    // 2. 내 프로필 수정
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<Void>> updateProfile(@RequestBody UserProfileDto dto, Principal principal) {
        String username = principal.getName();
        myPageService.updateUserProfile(username, dto);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // 3. 내 설문 전체 이력
    @GetMapping("/surveys")
    public ResponseEntity<ApiResponse<List<UserSurveyDto>>> getMySurveys(Principal principal) {
        Long userId = getUserId(principal.getName());
        List<UserSurveyDto> list = myPageService.getMySurveys(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 4. 즐겨찾기 설문 목록
    @GetMapping("/surveys/favorites")
    public ResponseEntity<ApiResponse<List<UserSurveyDto>>> getFavoriteSurveys(Principal principal) {
        Long userId = getUserId(principal.getName());
        List<UserSurveyDto> list = myPageService.getFavoriteSurveys(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 5. 즐겨찾기 설문 삭제
    @DeleteMapping("/surveys/favorites/{id}")
    public ResponseEntity<ApiResponse<Void>> removeFavoriteSurvey(@PathVariable Long id) {
        myPageService.removeFavoriteSurvey(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // 6. 내 게시글 목록
    @GetMapping("/posts")
    public ResponseEntity<ApiResponse<List<PostPreviewDto>>> getMyPosts(Principal principal) {
        Long userId = getUserId(principal.getName());
        List<PostPreviewDto> list = myPageService.getMyPosts(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 7. 내 댓글 목록
    @GetMapping("/comments")
    public ResponseEntity<ApiResponse<List<CommentPreviewDto>>> getMyComments(Principal principal) {
        Long userId = getUserId(principal.getName());
        List<CommentPreviewDto> list = myPageService.getMyComments(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 8. 내 알림 목록
    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<AlertDto>>> getMyAlerts(Principal principal) {
        Long userId = getUserId(principal.getName());
        List<AlertDto> list = myPageService.getMyAlerts(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 9. 내 신고 이력
    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<ReportDto>>> getMyReports(Principal principal) {
        Long userId = getUserId(principal.getName());
        List<ReportDto> list = myPageService.getMyReports(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    private Long getUserId(String username) {
        UserProfile user = userProfileRepository.findByUsername(username)
            .orElseThrow(() -> new MyPageException("사용자를 찾을 수 없습니다."));
        return user.getId();
    }
}
