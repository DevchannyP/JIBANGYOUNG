package com.jibangyoung.domain.auth.dto;

import com.jibangyoung.domain.auth.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
    private Long id;
    private String username;
    private String email;
    private String nickname;
    private String phone;
    private String profileImageUrl;
    private LocalDate birthDate;
    private String gender;
    private String region;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    private boolean isActive;

    public static UserInfoDto from(User user) {
        return UserInfoDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .profileImageUrl(user.getProfileImageUrl())
                .birthDate(user.getBirthDate())
                .gender(user.getGender())
                .region(user.getRegion())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .isActive(user.isActive())
                .build();
    }
}