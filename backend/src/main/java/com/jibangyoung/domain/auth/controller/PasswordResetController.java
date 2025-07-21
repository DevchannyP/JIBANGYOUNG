package com.jibangyoung.domain.auth.controller;

import com.jibangyoung.domain.auth.dto.*;
import com.jibangyoung.domain.auth.service.PasswordResetService;
import com.jibangyoung.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @Operation(summary = "[비밀번호 찾기] 비밀번호 재설정 메일 발송")
    @PostMapping("/send-reset-pw")
    public ResponseEntity<ApiResponse<Void>> sendResetPwEmail(@RequestBody @Valid PasswordResetRequest req) {
        passwordResetService.sendResetPwEmail(req);
        return ResponseEntity.ok(ApiResponse.success(null, "비밀번호 재설정 메일이 발송되었습니다."));
    }

    @Operation(summary = "[비밀번호 찾기] 재설정 토큰 유효성 검증")
    @PostMapping("/verify-reset-token")
    public ResponseEntity<ApiResponse<Void>> verifyResetToken(@RequestBody @Valid PasswordResetTokenVerifyRequest req) {
        passwordResetService.verifyResetToken(req);
        return ResponseEntity.ok(ApiResponse.success(null, "토큰 인증 성공"));
    }

    @Operation(summary = "[비밀번호 찾기] 비밀번호 변경 실행")
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody @Valid PasswordResetConfirmRequest req) {
        passwordResetService.resetPassword(req);
        return ResponseEntity.ok(ApiResponse.success(null, "비밀번호가 성공적으로 변경되었습니다."));
    }
}
