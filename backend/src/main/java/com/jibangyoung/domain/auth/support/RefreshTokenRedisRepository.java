// backend/src/main/java/com/jibangyoung/domain/auth/support/RefreshTokenRedisRepository.java
package com.jibangyoung.domain.auth.support;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

/**
 * ✅ Redis 기반 RefreshToken 저장소 (JWT RefreshToken 관리)
 * - Key: refresh_token:{token}
 * - Value: RefreshTokenRedis 객체 (직렬화/역직렬화)
 * - TTL: 토큰 만료 시간(초) 기준으로 관리
 */
@Repository
@RequiredArgsConstructor
public class RefreshTokenRedisRepository {

    private static final String PREFIX = "refresh_token:";

    // ⬇️ Value 타입 명확하게 지정
    private final RedisTemplate<String, RefreshTokenRedis> redisTemplate;

    /**
     * RefreshToken 저장 (TTL 적용)
     * @param token      저장할 토큰 객체
     * @param ttlSeconds 만료까지 남은 시간(초)
     */
    public void save(RefreshTokenRedis token, long ttlSeconds) {
        if (ttlSeconds <= 0) {
            // 만료 시간이 지난 토큰은 저장하지 않음
            return;
        }
        redisTemplate.opsForValue().set(PREFIX + token.getToken(), token, ttlSeconds, TimeUnit.SECONDS);
    }

    /**
     * 토큰 단건 조회 (Key: refresh_token:{token})
     */
    public RefreshTokenRedis findByToken(String token) {
        return redisTemplate.opsForValue().get(PREFIX + token);
    }

    /**
     * 토큰 삭제 (로그아웃 등)
     */
    public void deleteByToken(String token) {
        redisTemplate.delete(PREFIX + token);
    }

    /**
     * 토큰 무효화(revoke) 및 남은 TTL만큼 유지 (실제 만료 시간까지 보관)
     * - 만료 시간이 경과된 토큰은 즉시 삭제
     */
    public void revoke(String token) {
        RefreshTokenRedis rt = findByToken(token);
        if (rt != null) {
            rt.setRevoked(true);
            long seconds = Duration.between(LocalDateTime.now(), rt.getExpiresAt()).getSeconds();
            if (seconds > 0) {
                save(rt, seconds);
            } else {
                deleteByToken(token);
            }
        }
    }
}
