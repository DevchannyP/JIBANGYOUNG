package com.jibangyoung.domain.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialLoginRequestDto {

    @NotBlank(message = "Provider ID는 필수입니다")
    private String providerId;

    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    private String nickname;
    private String name;
    private String profileImageUrl;
    private String gender;
    private String birthDate; // yyyy-MM-dd 또는 yyyy
    private String phone;
}
