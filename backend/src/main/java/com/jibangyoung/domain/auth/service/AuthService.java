package com.jibangyoung.domain.auth.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.auth.dto.CheckEmailResponse;
import com.jibangyoung.domain.auth.dto.CheckUsernameResponse;
import com.jibangyoung.domain.auth.dto.LoginRequestDto;
import com.jibangyoung.domain.auth.dto.LoginResponseDto;
import com.jibangyoung.domain.auth.dto.SignupRequestDto;
import com.jibangyoung.domain.auth.dto.UserDto;
import com.jibangyoung.domain.auth.entity.EmailVerification;
import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.entity.UserStatus;
import com.jibangyoung.domain.auth.exception.AuthException;
import com.jibangyoung.domain.auth.repository.EmailVerificationRepository;
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
    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailService emailService;
    

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


    
    /**
     * [아이디 찾기] 인증코드 발송 (DB 기반, 5분 TTL)
     * - 기존 인증 내역 모두 삭제 후 새로 발송 (재사용 방지)
     * - EmailVerification DB에 저장, 이메일로 코드 발송
     */
    @Transactional
    public void sendCodeForFindId(String email) {
        // 기존 인증 내역 삭제 (중복 방지)
        emailVerificationRepository.deleteByEmail(email);

        // 6자리 랜덤 코드 생성 (0~999999, 앞자리 0 포함)
        String code = String.format("%06d", new Random().nextInt(1_000_000));

        // 인증 정보 저장 (verified = false)
        EmailVerification verification = EmailVerification.builder()
            .email(email)
            .code(code)
            .verified(false)
            .build();
        emailVerificationRepository.save(verification);

        // 이메일 전송 (비동기 발송 추천)
        emailService.sendAuthCodeMail(email, code);
    }

    /**
     * [아이디 찾기] 인증코드 검증 (5분 유효/미사용 시만)
     * - 유효성/만료/사용 여부 모두 체크
     * @return 성공 true, 실패 false (불일치만 false, 만료/사용됨은 예외)
     */
    @Transactional
    public boolean verifyFindIdCode(String email, String code) {
        EmailVerification verification = emailVerificationRepository
            .findTopByEmailOrderByCreatedAtDesc(email)
            .orElseThrow(() -> new AuthException("인증코드가 존재하지 않습니다. 다시 요청하세요."));

        // 5분 내 코드만 유효
        if (verification.getCreatedAt().isBefore(LocalDateTime.now().minusMinutes(5))) {
            throw new AuthException("인증코드가 만료되었습니다. 다시 요청하세요.");
        }
        // 코드 일치 체크 (불일치만 false)
        if (!verification.getCode().equals(code)) {
            return false;
        }
        // 이미 사용된 코드 방지
        if (Boolean.TRUE.equals(verification.getVerified())) {
            throw new AuthException("이미 사용된 인증코드입니다. 다시 요청하세요.");
        }

        verification.setVerified(true); // 사용 처리(1회용)
        emailVerificationRepository.save(verification); // DB 반영 (중요!)
        return true;
    }

    /**
     * [아이디 찾기] 이메일+인증코드로 아이디 반환
     * - 인증 코드 5분/1회 사용 제한
     * - verified=true(인증됨)만 아이디 조회 허용
     */
    @Transactional(readOnly = true)
    public String findIdByEmailAndCode(String email, String code) {
        EmailVerification verification = emailVerificationRepository
            .findTopByEmailOrderByCreatedAtDesc(email)
            .orElseThrow(() -> new AuthException("인증코드가 발송되지 않았거나 만료되었습니다."));

        // 5분 유효성 검사
        if (verification.getCreatedAt().isBefore(LocalDateTime.now().minusMinutes(5))) {
            throw new AuthException("인증코드가 만료되었습니다. (5분 이내 코드만 유효)");
        }
        // 코드 일치
        if (!verification.getCode().equals(code)) {
            throw new AuthException("인증코드가 일치하지 않습니다.");
        }
        // 인증 성공(verified=true)만 통과
        if (!Boolean.TRUE.equals(verification.getVerified())) {
            throw new AuthException("이메일 인증을 먼저 완료해주세요.");
        }

        // 해당 이메일로 활성 상태 유저 조회
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new AuthException("해당 이메일로 등록된 계정이 없습니다."));
        if (!user.isActive()) {
            throw new AuthException("탈퇴/정지/비활성 계정입니다.");
        }
        return user.getUsername();
    }
}


