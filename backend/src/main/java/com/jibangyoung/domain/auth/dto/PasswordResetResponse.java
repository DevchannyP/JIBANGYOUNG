package com.jibangyoung.domain.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PasswordResetResponse {
    @Schema(description = "성공 여부")
    private boolean success;
    @Schema(description = "메시지")
    private String message;
}
