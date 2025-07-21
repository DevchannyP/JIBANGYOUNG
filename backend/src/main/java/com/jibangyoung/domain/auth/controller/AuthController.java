package com.jibangyoung.domain.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.auth.dto.CheckEmailResponse;
import com.jibangyoung.domain.auth.dto.CheckUsernameResponse;
import com.jibangyoung.domain.auth.dto.EmailSendRequest;
import com.jibangyoung.domain.auth.dto.EmailVerifyRequest;
import com.jibangyoung.domain.auth.dto.FindIdRequest;
import com.jibangyoung.domain.auth.dto.FindIdResponse;
import com.jibangyoung.domain.auth.dto.LoginRequestDto;
import com.jibangyoung.domain.auth.dto.LoginResponseDto;
import com.jibangyoung.domain.auth.dto.SignupRequestDto;
import com.jibangyoung.domain.auth.dto.UserDto;
import com.jibangyoung.domain.auth.service.AuthService;
import com.jibangyoung.global.common.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * [AuthController]
 * - 회원가입, 로그인, 토큰, 이메일 인증, 아이디/비밀번호 찾기 등 인증 전체 컨트롤러
 * - 비밀번호 재설정 로직은 Redis TTL 기반, 실무 최적화
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
@Slf4j
public class AuthController {

    private final AuthService authService;


    // ======== 회원가입 & 로그인 ========

    @Operation(summary = "회원가입")
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserDto>> signup(@Valid @RequestBody SignupRequestDto signupRequest) {
        log.info("[SIGNUP] 요청: {}", signupRequest.getUsername());
        UserDto user = authService.signup(signupRequest);
        return ResponseEntity.ok(ApiResponse.success(user, "회원가입이 완료되었습니다."));
    }

    @Operation(summary = "로그인")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        log.info("[LOGIN] 요청: {}", loginRequest.getUsername());
        LoginResponseDto loginResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(loginResponse, "로그인에 성공했습니다."));
    }

    @Operation(summary = "리프레시 토큰으로 토큰 재발급")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponseDto>> refreshToken(
            @RequestHeader("Refresh-Token") String refreshToken) {
        log.info("[REFRESH] 토큰 갱신 요청");
        LoginResponseDto loginResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(loginResponse, "토큰이 갱신되었습니다."));
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Refresh-Token") String refreshToken) {
        log.info("[LOGOUT] 요청");
        authService.logout(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(null, "로그아웃이 완료되었습니다."));
    }

    @Operation(summary = "모든 기기 로그아웃")
    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<Void>> logoutAll(@RequestHeader("X-Username") String username) {
        log.info("[LOGOUT-ALL] 요청: {}", username);
        authService.logoutAll(username);
        return ResponseEntity.ok(ApiResponse.success(null, "모든 기기에서 로그아웃되었습니다."));
    }

    // ======== 중복확인 ========

    @Operation(summary = "아이디(Username) 중복확인")
    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<CheckUsernameResponse>> checkUsername(@RequestParam String username) {
        CheckUsernameResponse res = authService.checkUsername(username);
        return ResponseEntity.ok(ApiResponse.success(res, res.getMessage()));
    }

    @Operation(summary = "이메일 중복확인")
    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<CheckEmailResponse>> checkEmail(@RequestParam String email) {
        CheckEmailResponse res = authService.checkEmail(email);
        return ResponseEntity.ok(ApiResponse.success(res, res.getMessage()));
    }

    // ======== 이메일 인증코드 (회원가입/일반 인증용) ========

    @Operation(summary = "이메일 인증코드 발송")
    @PostMapping("/send-code")
    public ResponseEntity<ApiResponse<Void>> sendCode(@RequestBody @Valid EmailSendRequest req) {
        authService.sendVerificationCode(req.getEmail());
        return ResponseEntity.ok(ApiResponse.success(null, "이메일로 인증코드가 발송되었습니다."));
    }

    @Operation(summary = "이메일 인증코드 검증")
    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse<Boolean>> verifyCode(@RequestBody @Valid EmailVerifyRequest req) {
        boolean valid = authService.verifyCode(req.getEmail(), req.getCode());
        String msg = valid ? "인증 성공!" : "인증코드가 올바르지 않습니다.";
        return ResponseEntity.ok(ApiResponse.success(valid, msg));
    }

    // ======== [아이디 찾기] 인증코드 및 아이디 반환 ========

    @Operation(summary = "[아이디 찾기] 인증코드 발송")
    @PostMapping("/find-id/send-code")
    public ResponseEntity<ApiResponse<Void>> sendFindIdCode(@RequestBody @Valid EmailSendRequest req) {
        authService.sendCodeForFindId(req.getEmail());
        return ResponseEntity.ok(ApiResponse.success(null, "아이디 찾기 인증코드 발송 완료"));
    }

    @Operation(summary = "[아이디 찾기] 인증코드 검증")
    @PostMapping("/find-id/verify-code")
    public ResponseEntity<ApiResponse<Boolean>> verifyFindIdCode(@RequestBody @Valid EmailVerifyRequest req) {
        boolean valid = authService.verifyFindIdCode(req.getEmail(), req.getCode());
        return ResponseEntity.ok(ApiResponse.success(valid, valid ? "인증 성공" : "인증 실패"));
    }

    @Operation(summary = "[아이디 찾기] 이메일+코드로 아이디 반환")
    @PostMapping("/find-id")
    public ResponseEntity<ApiResponse<FindIdResponse>> findId(@RequestBody @Valid FindIdRequest req) {
        String username = authService.findIdByEmailAndCode(req.getEmail(), req.getCode());
        return ResponseEntity.ok(ApiResponse.success(new FindIdResponse(username), "아이디 조회 성공"));
    }


}
