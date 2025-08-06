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
        String method = request.getMethod();
        log.debug("[JWT FILTER] {} {}", method, uri);

        // 공개 경로는 토큰 검증 스킵
        if (isPublicUri(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = resolveToken(request);

        try {
            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                Authentication authentication = jwtTokenProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("[JWT FILTER] 인증 성공: {}", authentication.getName());
            } else {
                log.debug("[JWT FILTER] 토큰 없음 or 유효성 실패");
                SecurityContextHolder.clearContext();
            }
        } catch (Exception ex) {
            log.warn("[JWT FILTER] 인증 오류: {}", ex.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicUri(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // OPTIONS 요청은 항상 허용
        if ("OPTIONS".equals(method)) {
            return true;
        }

        // 인증 관련 API는 모두 공개
        if (uri.startsWith("/api/auth/")) {
            return true;
        }

        // 공개 API
        if (uri.startsWith("/api/public/")) {
            return true;
        }

        // 커뮤니티 GET 요청만 공개
        if (uri.startsWith("/api/community/") && "GET".equals(method)) {
            return true;
        }

        // 정책 GET 요청 중 일부는 공개
        if (uri.startsWith("/api/policy/") && "GET".equals(method)) {
            // 찜 관련과 추천 리스트를 제외한 나머지는 공개
            if (!uri.contains("/favorites") && !uri.contains("/recList")) {
                return true;
            }
        }

        // 대시보드는 모두 공개
        if (uri.startsWith("/api/dashboard/")) {
            return true;
        }

        return false;
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AuthConstants.AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(AuthConstants.TOKEN_PREFIX)) {
            return bearerToken.substring(AuthConstants.TOKEN_PREFIX.length());
        }
        return null;
    }
}