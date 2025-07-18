// SignupRequestDto.java
package com.jibangyoung.domain.auth.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
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
    private LocalDate birthDate;
    private String gender;
    private String region;

    public boolean isPasswordMatching() {
        return password != null && password.equals(passwordConfirm);
    }
}