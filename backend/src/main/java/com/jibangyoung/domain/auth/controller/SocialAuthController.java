package com.jibangyoung.domain.auth.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.auth.dto.LoginResponseDto;
import com.jibangyoung.domain.auth.dto.SocialLoginRequestDto;
import com.jibangyoung.domain.auth.service.NaverAuthService;
import com.jibangyoung.global.common.ApiResponse;
import com.jibangyoung.global.exception.BusinessException;
import com.jibangyoung.global.exception.ErrorCode;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController("naverSocialAuthController") // ✅ 빈 이름 명시 (잠재 중복 방지)
@RequestMapping("/api/auth") // 공개 경로 전용
@RequiredArgsConstructor
@Slf4j
public class SocialAuthController {

    private final NaverAuthService naverAuthService;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    private String frontendCallbackUrl() {
        return frontendUrl + "/auth/callback";
    }

    @GetMapping("/naver")
    public void naverLogin(HttpServletResponse response) throws IOException {
        try {
            String authUrl = naverAuthService.getAuthorizationUrl();
            log.info("네이버 로그인 리다이렉트: {}", authUrl);
            response.sendRedirect(authUrl);
        } catch (Exception e) {
            log.error("네이버 로그인 URL 생성 실패", e);
            String msg = URLEncoder.encode("로그인 URL 생성에 실패했습니다", StandardCharsets.UTF_8);
            response.sendRedirect(frontendCallbackUrl() + "?error=" + msg);
        }
    }

    @GetMapping("/naver/callback")
    public void naverCallback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            @RequestParam(required = false) String error_description,
            HttpServletResponse response) throws IOException {

        if (error != null) {
            log.error("네이버 로그인 에러: {} - {}", error, error_description);
            String msg = URLEncoder.encode("네이버 로그인이 취소되었거나 오류가 발생했습니다", StandardCharsets.UTF_8);
            response.sendRedirect(frontendCallbackUrl() + "?error=" + msg);
            return;
        }
        if (code == null || code.isEmpty()) {
            log.error("네이버 콜백 - code 파라미터 누락");
            String msg = URLEncoder.encode("인증 코드가 없습니다", StandardCharsets.UTF_8);
            response.sendRedirect(frontendCallbackUrl() + "?error=" + msg);
            return;
        }
        if (state == null || state.isEmpty()) {
            log.error("네이버 콜백 - state 파라미터 누락");
            String msg = URLEncoder.encode("상태 값이 없습니다", StandardCharsets.UTF_8);
            response.sendRedirect(frontendCallbackUrl() + "?error=" + msg);
            return;
        }

        try {
            LoginResponseDto loginResponse = naverAuthService.processCallback(code, state);

            String redirectUrl = String.format(
                    "%s?accessToken=%s&refreshToken=%s&provider=naver",
                    frontendCallbackUrl(),
                    URLEncoder.encode(loginResponse.getAccessToken(), StandardCharsets.UTF_8),
                    URLEncoder.encode(loginResponse.getRefreshToken(), StandardCharsets.UTF_8));

            log.info("네이버 로그인 성공, 리다이렉트 to: {}", redirectUrl);
            response.sendRedirect(redirectUrl);

        } catch (BusinessException e) {
            log.error("네이버 로그인 비즈니스 예외: {}", e.getMessage(), e);
            String msg = URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
            response.sendRedirect(frontendCallbackUrl() + "?error=" + msg);
        } catch (Exception e) {
            log.error("네이버 로그인 콜백 처리 실패", e);
            String msg = URLEncoder.encode("로그인 처리 중 오류가 발생했습니다", StandardCharsets.UTF_8);
            response.sendRedirect(frontendCallbackUrl() + "?error=" + msg);
        }
    }

    @PostMapping("/social/naver")
    public ApiResponse<LoginResponseDto> socialLogin(@Valid @RequestBody SocialLoginRequestDto request) {
        try {
            LoginResponseDto res = naverAuthService.processSocialLogin(request);
            return ApiResponse.success(res, "네이버 소셜 로그인 성공");
        } catch (BusinessException e) {
            log.error("네이버 소셜 로그인 실패: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("네이버 소셜 로그인 처리 중 오류", e);
            throw new BusinessException(ErrorCode.SOCIAL_LOGIN_FAILED, "소셜 로그인 처리 중 오류가 발생했습니다");
        }
    }
}
