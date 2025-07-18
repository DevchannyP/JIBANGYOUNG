package com.jibangyoung.domain.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.auth.dto.*;
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
    private final VerificationService verificationService;
    private final PasswordEncoder passwordEncoder;

    // ======================
    // 1. 회원가입
    // ======================
    public UserDto signup(SignupRequestDto signupRequest) {
        log.info("[SIGNUP] 요청 - username={}, email={}", signupRequest.getUsername(), signupRequest.getEmail());
        validateSignupRequest(signupRequest);

        if (userRepository.existsByUsername(signupRequest.getUsername()))
            throw new BusinessException(ErrorCode.USERNAME_ALREADY_EXISTS);
        if (userRepository.existsByEmail(signupRequest.getEmail()))
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);

        // TODO: 이메일 인증(verify) 필요 시 아래에서 검증

        User user = User.createUser(
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                passwordEncoder.encode(signupRequest.getPassword()),
                signupRequest.getNickname(),
                signupRequest.getPhone(),
                signupRequest.getProfileImageUrl(),
                signupRequest.getBirthDate(),
                signupRequest.getGender(),
                signupRequest.getRegion()
        );
        userRepository.save(user);
        return UserDto.from(user);
    }

    // ======================
    // 2. 로그인 (JWT 반환)
    // ======================
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

            userService.updateLastLogin(user); // 마지막 로그인 갱신

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

    // ======================
    // 3. 리프레시 토큰 → 액세스 토큰 재발급
    // ======================
    public LoginResponseDto refreshToken(String refreshToken) {
        log.info("[REFRESH] 토큰 재발급 요청");
        try {
            LoginResponseDto dto = tokenService.refreshAccessToken(refreshToken);
            log.info("[REFRESH] 토큰 재발급 성공");
            return dto;
        } catch (Exception e) {
            log.error("[REFRESH] 토큰 재발급 실패 - {}", e.getMessage(), e);
            throw e;
        }
    }

    // ======================
    // 4. 로그아웃 (토큰 폐기)
    // ======================
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

    // ======================
    // 5. 아이디/이메일 중복확인
    // ======================
    public CheckUsernameResponse checkUsername(String username) {
        boolean exists = userRepository.existsByUsername(username);
        return CheckUsernameResponse.builder()
            .data(!exists)
            .message(exists ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다.")
            .build();
    }

    public CheckEmailResponse checkEmail(String email) {
        boolean exists = userRepository.existsByEmail(email);
        return CheckEmailResponse.builder()
            .data(!exists)
            .message(exists ? "이미 등록된 이메일입니다." : "사용 가능한 이메일입니다.")
            .build();
    }

    // ======================
    // 6. 이메일 인증 (Redis 활용)
    // ======================
    public void sendVerificationCode(String email) {
        verificationService.sendCode(email); // Redis에 코드 저장 + 이메일 발송
    }

    public boolean verifyCode(String email, String code) {
        return verificationService.verifyCode(email, code); // Redis에서 검증
    }

    // ======================
    // 유틸
    // ======================
    private void validateSignupRequest(SignupRequestDto signupRequest) {
        if (!signupRequest.isPasswordMatching())
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
    }
}
