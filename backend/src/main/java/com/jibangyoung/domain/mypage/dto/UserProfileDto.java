// UserProfileDto.java
package com.jibangyoung.domain.mypage.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.jibangyoung.domain.auth.entity.User; // UserProfile → User로 변경

import lombok.Builder;

@Builder
public record UserProfileDto(
        Long id,
        String username,
        String email,
        String nickname,
        String phone,
        String profileImageUrl,
        LocalDate birthDate,
        String gender,
        String region,
        String role,
        String status,
        LocalDateTime lastLoginAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    // UserProfile → User 파라미터로 변경!
    public static UserProfileDto from(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .profileImageUrl(user.getProfileImageUrl())
                .birthDate(user.getBirthDate())
                .gender(user.getGender())
                .region(user.getRegion())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
