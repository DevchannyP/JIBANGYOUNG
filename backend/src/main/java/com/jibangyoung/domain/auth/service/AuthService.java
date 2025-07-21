package com.jibangyoung.domain.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.auth.dto.LoginRequestDto;
import com.jibangyoung.domain.auth.dto.LoginResponseDto;
import com.jibangyoung.domain.auth.dto.SignupRequestDto;
import com.jibangyoung.domain.auth.dto.UserDto;
import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.entity.UserStatus;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.global.exception.BusinessException;
import com.jibangyoung.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final TokenService tokenService;

    // ✅ RefreshToken 관련 Repository는 이 클래스에 직접 의존하지 않음
    // 모든 토큰 저장/조회/폐기 로직은 TokenService 내부에서 처리!
    // (SOLID: 단일책임원칙, 유지보수/테스트/확장에 유리)

    public UserDto signup(SignupRequestDto signupRequest) {
        log.info("[SIGNUP] 요청 - username={}, email={}", signupRequest.getUsername(), signupRequest.getEmail());
        validateSignupRequest(signupRequest);

        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            log.warn("[SIGNUP] 실패 - 중복 username: {}", signupRequest.getUsername());
            throw new BusinessException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            log.warn("[SIGNUP] 실패 - 중복 email: {}", signupRequest.getEmail());
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        try {
            User user = userService.createUser(signupRequest);
            log.info("[SIGNUP] 성공 - username: {}", user.getUsername());
            return UserDto.from(user);
        } catch (Exception e) {
            log.error("[SIGNUP] 내부 오류 - {}", e.getMessage(), e);
            throw e;
        }
    }

    public LoginResponseDto login(LoginRequestDto loginRequest) {
        log.info("[LOGIN] 요청 - username={}", loginRequest.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            User user = userRepository.findByUsernameAndStatus(loginRequest.getUsername(), UserStatus.ACTIVE)
                    .orElseThrow(() -> {
                        log.warn("[LOGIN] 실패 - 존재하지 않거나 비활성화된 사용자: {}", loginRequest.getUsername());
                        return new BusinessException(ErrorCode.USER_NOT_FOUND);
                    });

            // 마지막 로그인 시간 업데이트
            userService.updateLastLogin(user);

            // ✅ 토큰 생성/저장/관리 책임은 tokenService에 위임!
            LoginResponseDto loginResponse = tokenService.generateTokens(authentication, user);

            log.info("[LOGIN] 성공 - username: {}", user.getUsername());
            return loginResponse;

        } catch (AuthenticationException e) {
            log.warn("[LOGIN] 인증 실패 - username: {}, message: {}", loginRequest.getUsername(), e.getMessage());
            throw new BusinessException(ErrorCode.INVALID_LOGIN_CREDENTIALS);
        } catch (Exception e) {
            log.error("[LOGIN] 내부 오류 - username: {}, error: {}", loginRequest.getUsername(), e.getMessage(), e);
            throw e;
        }
    }

    public LoginResponseDto refreshToken(String refreshToken) {
        log.info("[REFRESH] 토큰 재발급 요청");
        try {
            // ✅ 리프레시토큰 검증/교체 책임도 tokenService가 전담
            LoginResponseDto dto = tokenService.refreshAccessToken(refreshToken);
            log.info("[REFRESH] 토큰 재발급 성공");
            return dto;
        } catch (Exception e) {
            log.error("[REFRESH] 토큰 재발급 실패 - {}", e.getMessage(), e);
            throw e;
        }
    }

    public void logout(String refreshToken) {
        log.info("[LOGOUT] 로그아웃 요청 - refreshToken: {}", refreshToken);
        try {
            tokenService.revokeToken(refreshToken);
            log.info("[LOGOUT] 로그아웃 성공");
        } catch (Exception e) {
            log.error("[LOGOUT] 실패 - {}", e.getMessage(), e);
            throw e;
        }
    }

    public void logoutAll(String username) {
        log.info("[LOGOUT_ALL] 전체 로그아웃 요청 - username: {}", username);
        try {
            tokenService.revokeAllUserTokens(username);
            log.info("[LOGOUT_ALL] 전체 로그아웃 성공 - username: {}", username);
        } catch (Exception e) {
            log.error("[LOGOUT_ALL] 실패 - username: {}, error: {}", username, e.getMessage(), e);
            throw e;
        }
    }

    private void validateSignupRequest(SignupRequestDto signupRequest) {
        if (!signupRequest.isPasswordMatching()) {
            log.warn("[SIGNUP] 비밀번호 불일치 - username: {}", signupRequest.getUsername());
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }
    }
}
