// backend/src/main/java/com/jibangyoung/domain/auth/service/TokenService.java
package com.jibangyoung.domain.auth.service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// import com.jibangyoung.domain.auth.AuthConstants;
import com.jibangyoung.domain.auth.dto.LoginResponseDto;
import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.auth.support.RefreshTokenRedis;
import com.jibangyoung.domain.auth.support.RefreshTokenRedisRepository;
import com.jibangyoung.global.exception.BusinessException;
import com.jibangyoung.global.exception.ErrorCode;
import com.jibangyoung.global.security.CustomUserDetailsService;
import com.jibangyoung.global.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TokenService {

    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    private final Clock clock = Clock.systemDefaultZone();

    public LoginResponseDto generateTokens(Authentication authentication, User user) {
        // 기존 사용자 토큰 정리/제한 (생략 또는 Redis에서 직접 키카운트 가능)
        String accessToken = jwtTokenProvider.createAccessToken(authentication);
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUsername());
        LocalDateTime refreshExpiresAt = jwtTokenProvider.getExpirationDateFromToken(refreshToken);

        // Redis에 저장 (TTL은 토큰 만료 시각 기준, 초 단위)
        long ttlSeconds = jwtTokenProvider.getRefreshTokenValidityInMilliseconds() / 1000;
        RefreshTokenRedis tokenObj = RefreshTokenRedis.builder()
                .token(refreshToken)
                .username(user.getUsername())
                .expiresAt(refreshExpiresAt)
                .revoked(false)
                .build();
        refreshTokenRedisRepository.save(tokenObj, ttlSeconds);

        LocalDateTime now = LocalDateTime.now(clock);
        LocalDateTime accessTokenExpiresAt = now
                .plusSeconds(jwtTokenProvider.getAccessTokenValidityInMilliseconds() / 1000);

        return LoginResponseDto.of(
                user, accessToken, refreshToken,
                jwtTokenProvider.getAccessTokenValidityInMilliseconds() / 1000,
                now.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                accessTokenExpiresAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
    }

    public LoginResponseDto refreshAccessToken(String refreshToken) {
        RefreshTokenRedis storedToken = refreshTokenRedisRepository.findByToken(refreshToken);
        if (storedToken == null || storedToken.isExpired() || storedToken.isRevoked()) {
            throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        User user = userRepository.findByUsername(storedToken.getUsername())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getUsername());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                userDetails.getAuthorities());

        // ⭐️ 새 리프레시 토큰 발급
        String newRefreshToken = jwtTokenProvider.createRefreshToken(user.getUsername());
        LocalDateTime refreshExpiresAt = jwtTokenProvider.getExpirationDateFromToken(newRefreshToken);

        // 기존 토큰 revoke, 새 토큰 저장
        storedToken.setRevoked(true);
        refreshTokenRedisRepository.save(storedToken,
                java.time.Duration.between(LocalDateTime.now(), storedToken.getExpiresAt()).getSeconds());

        RefreshTokenRedis tokenObj = RefreshTokenRedis.builder()
                .token(newRefreshToken)
                .username(user.getUsername())
                .expiresAt(refreshExpiresAt)
                .revoked(false)
                .build();
        long ttlSeconds = jwtTokenProvider.getRefreshTokenValidityInMilliseconds() / 1000;
        refreshTokenRedisRepository.save(tokenObj, ttlSeconds);

        String newAccessToken = jwtTokenProvider.createAccessToken(authentication);
        LocalDateTime now = LocalDateTime.now(clock);
        LocalDateTime accessTokenExpiresAt = now
                .plusSeconds(jwtTokenProvider.getAccessTokenValidityInMilliseconds() / 1000);

        return LoginResponseDto.of(
                user, newAccessToken, newRefreshToken, // ⭐️ 새 토큰 반환
                jwtTokenProvider.getAccessTokenValidityInMilliseconds() / 1000,
                now.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                accessTokenExpiresAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
    }

    // 로그아웃 - 단일 토큰 무효화
    public void revokeToken(String refreshToken) {
        RefreshTokenRedis token = refreshTokenRedisRepository.findByToken(refreshToken);
        if (token != null) {
            token.setRevoked(true);
            refreshTokenRedisRepository.save(token,
                    java.time.Duration.between(LocalDateTime.now(), token.getExpiresAt()).getSeconds());
            log.info("RefreshToken 무효화(로그아웃): {}", token.getUsername());
        }
    }

    // 전체 로그아웃 - Redis의 키패턴으로 전체 삭제 (사용자 단위)
    public void revokeAllUserTokens(String username) {
        // 실무: Redis Scan으로 "refresh_token:*" 모두 탐색 & username 일치만 삭제/무효화
        // 여기서는 단순화: (실제로는 Lua Script/SCAN/Pattern 등 활용)
        // for demo:
        log.warn("[DEMO] 전체 로그아웃은 Redis SCAN 키패턴, Lua Script 등으로 구현 필요");
        // 구현 참고:
        // https://stackoverflow.com/questions/37731251/how-to-delete-keys-matching-a-pattern-using-spring-data-redis
    }
}
