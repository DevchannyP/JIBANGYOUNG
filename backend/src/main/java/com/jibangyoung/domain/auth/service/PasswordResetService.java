package com.jibangyoung.domain.auth.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.auth.dto.PasswordResetConfirmRequest;
import com.jibangyoung.domain.auth.dto.PasswordResetRequest;
import com.jibangyoung.domain.auth.dto.PasswordResetTokenVerifyRequest;
import com.jibangyoung.domain.auth.entity.PasswordResetToken;
import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.exception.PasswordResetException;
import com.jibangyoung.domain.auth.repository.PasswordResetTokenRepository;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.auth.support.PasswordResetMailService;
import com.jibangyoung.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordResetMailService mailService;
    private final PasswordEncoder passwordEncoder;

@Transactional
public void sendResetPwEmail(PasswordResetRequest req) {
    User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new PasswordResetException(ErrorCode.USER_NOT_FOUND));

    tokenRepository.deleteByEmail(req.getEmail()); // 1회성 정책

    String token = UUID.randomUUID().toString().replace("-", "");
    LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(30);

    PasswordResetToken entity = PasswordResetToken.builder()
            .email(req.getEmail())
            .token(token)
            .expiresAt(expiresAt)
            .used(false)
            .build();
    tokenRepository.save(entity);

    // ---------- (★ 여기를 하드코딩) ----------
    // String resetLink = "https://jibangyoung.kr/auth/reset-password?token=" + token;
    String resetLink = "http://localhost:3000/auth/reset-password?token=" + token; // <-- 개발환경용!
    // 운영은 위 주석처리, 개발/테스트는 아래 줄 사용
    mailService.sendPasswordResetMail(req.getEmail(), resetLink);
}


    // 2. 토큰 검증
    @Transactional(readOnly = true)
    public void verifyResetToken(PasswordResetTokenVerifyRequest req) {
        PasswordResetToken token = tokenRepository.findByToken(req.getToken())
                .orElseThrow(() -> new PasswordResetException(ErrorCode.TOKEN_INVALID));
        if (token.getUsed() || token.isExpired())
            throw new PasswordResetException(ErrorCode.TOKEN_EXPIRED);
    }

    // 3. 비밀번호 변경
@Transactional
public void resetPassword(PasswordResetConfirmRequest req) {
    PasswordResetToken token = tokenRepository.findByToken(req.getToken())
            .orElseThrow(() -> new PasswordResetException(ErrorCode.TOKEN_INVALID));
    if (token.getUsed() || token.isExpired())
        throw new PasswordResetException(ErrorCode.TOKEN_EXPIRED);

    User user = userRepository.findByEmail(token.getEmail())
            .orElseThrow(() -> new PasswordResetException(ErrorCode.USER_NOT_FOUND));
    // 반드시 newPassword 사용!
    user.changePassword(passwordEncoder.encode(req.getNewPassword()));
    token.setUsed(true);
}

}
