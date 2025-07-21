package com.jibangyoung.domain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetConfirmRequest {
    private String token;
    private String newPassword;           // 프론트도 반드시 newPassword로 보낼 것!
    private String newPasswordConfirm;
}
