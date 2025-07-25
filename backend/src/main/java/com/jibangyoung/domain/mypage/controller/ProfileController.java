package com.jibangyoung.domain.mypage.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mypage.dto.UserProfileDto;
import com.jibangyoung.domain.mypage.service.ProfileService;
import com.jibangyoung.global.common.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Tag(name = "마이페이지 - 프로필", description = "프로필 조회 및 수정 API")
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // ✅ 내 프로필 조회
    @Operation(summary = "내 프로필 조회")
    @GetMapping("/users/{userId}/profile")
    public ApiResponse<UserProfileDto> getUserProfile(@PathVariable Long userId) {
        return ApiResponse.success(profileService.getUserProfile(userId));
    }

    // ✅ 내 프로필 수정
    @Operation(summary = "내 프로필 수정")
    @PatchMapping("/users/{userId}/profile")
    public ApiResponse<Void> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        profileService.updateUserProfile(
            userId,
            request.getNickname(),
            request.getPhone(),
            request.getProfileImageUrl(),
            request.getRegion()
        );
        return ApiResponse.success(null);
    }

    // ✅ 요청 DTO: record가 아니라 class로 (추가 필드/메서드 확장 위해)
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {
        @Size(min = 1, max = 16)
        private String nickname;
        private String phone;
        private String profileImageUrl;
        private String region;
    }
}
