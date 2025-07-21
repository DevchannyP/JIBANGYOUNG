package com.jibangyoung.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class PasswordResetTokenVerifyRequest {
    @NotBlank
    private String token;
}
