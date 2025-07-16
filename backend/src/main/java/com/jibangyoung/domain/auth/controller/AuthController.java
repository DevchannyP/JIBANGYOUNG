package com.jibangyoung.domain.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.auth.dto.LoginRequestDto;
import com.jibangyoung.domain.auth.dto.LoginResponseDto;
import com.jibangyoung.domain.auth.dto.SignupRequestDto;
import com.jibangyoung.domain.auth.dto.UserDto;
import com.jibangyoung.domain.auth.service.AuthService;
import com.jibangyoung.global.common.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserDto>> signup(@Valid @RequestBody SignupRequestDto signupRequest) {
        log.info("회원가입 요청: {}", signupRequest.getUsername());

        UserDto user = authService.signup(signupRequest);

        return ResponseEntity.ok(ApiResponse.success(user, "회원가입이 완료되었습니다."));
    }
// 진행중
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        log.info("로그인 요청: {}", loginRequest.getUsername());

        LoginResponseDto loginResponse = authService.login(loginRequest);

        return ResponseEntity.ok(ApiResponse.success(loginResponse, "로그인이 완료되었습니다."));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponseDto>> refreshToken(
            @RequestHeader("Refresh-Token") String refreshToken) {
        log.info("토큰 갱신 요청");

        LoginResponseDto loginResponse = authService.refreshToken(refreshToken);

        return ResponseEntity.ok(ApiResponse.success(loginResponse, "토큰이 갱신되었습니다."));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader("Refresh-Token") String refreshToken) {
        log.info("로그아웃 요청");

        authService.logout(refreshToken);

        return ResponseEntity.ok(ApiResponse.success(null, "로그아웃이 완료되었습니다."));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<Void>> logoutAll(
            @RequestHeader("X-Username") String username) {
        log.info("모든 기기 로그아웃 요청: {}", username);

        authService.logoutAll(username);

        return ResponseEntity.ok(ApiResponse.success(null, "모든 기기에서 로그아웃되었습니다."));
    }
}
