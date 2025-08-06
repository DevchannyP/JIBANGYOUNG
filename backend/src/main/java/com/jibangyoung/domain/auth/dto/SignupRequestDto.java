// SignupRequestDto.java
package com.jibangyoung.domain.auth.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequestDto {
    @NotBlank(message = "사용자명을 입력해주세요.")
    private String username;

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    private String password;

    @NotBlank(message = "비밀번호 확인을 입력해주세요.")
    private String passwordConfirm;

    @NotBlank(message = "닉네임을 입력해주세요.")
    private String nickname;

    private String phone;
    private String profileImageUrl;

    // ✅ 커스텀 데시리얼라이저 적용!
    @JsonDeserialize(using = EmptyStringToNullLocalDateDeserializer.class)
    private LocalDate birthDate;

    private String gender;
    private String region;

    public boolean isPasswordMatching() {
        return password != null && password.equals(passwordConfirm);
    }
}
