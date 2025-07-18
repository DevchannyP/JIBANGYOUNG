package com.jibangyoung.global.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jibangyoung.domain.auth.AuthConstants;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String uri = request.getRequestURI();
        log.warn("[JWT FILTER] 요청 URI = {}", uri);

        // ✅ permitAll로 허용한 모든 경로를 화이트리스트로 contains로 스킵!
        if (isPermitAllUri(uri)) {
            log.warn("[JWT FILTER] permitAll 경로로 JWT 검사 없이 통과: {}", uri);
            filterChain.doFilter(request, response);
            return;
        }

        String token = resolveToken(request);

        try {
            if (StringUtils.hasText(token)) {
                log.warn("[JWT FILTER] 토큰 감지, 유효성 검사 시도: {}", token);
                if (jwtTokenProvider.validateToken(token)) {
                    Authentication authentication = jwtTokenProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.warn("[JWT FILTER] JWT 인증 성공: {}", authentication.getName());
                } else {
                    log.warn("[JWT FILTER] 토큰 유효성 검사 실패");
                }
            } else {
                log.warn("[JWT FILTER] 토큰 없음 (인증 불가 경로)");
            }
        } catch (Exception ex) {
            log.warn("[JWT FILTER] JWT 인증 오류: {}", ex.getMessage());
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(request, response);
    }

    // ✅ permitAll 경로 모두 contains로 더 유연하게!
    private boolean isPermitAllUri(String uri) {
        boolean result = uri.contains("/api/admin/")
            || uri.contains("/api/auth/")
            || uri.contains("/api/users/")
            || uri.contains("/api/community/")
            || uri.contains("/api/dashboard/")
            || uri.contains("/api/mentor/")
            || uri.contains("/api/mypage/")
            || uri.contains("/api/policy/")
            || uri.contains("/api/recommendation/")
            || uri.contains("/api/report/")
            || uri.contains("/api/search/")
            || uri.contains("/api/survey/");
        log.warn("[JWT FILTER] permitAll 체크: {} → {}", uri, result);
        return result;
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AuthConstants.AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(AuthConstants.TOKEN_PREFIX)) {
            return bearerToken.substring(AuthConstants.TOKEN_PREFIX.length());
        }
        return null;
    }
}
