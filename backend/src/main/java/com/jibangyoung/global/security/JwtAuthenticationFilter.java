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
        log.debug("[JWT FILTER] 요청 URI = {}", uri);

        // 아래 경로는 토큰 검사 없이 통과
        if (isPermitAllUri(uri)) {
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

    private boolean isPermitAllUri(String uri) {
        // ✅ 실무: 모두 공개 허용할 경로를 여기서 명확히 지정
        return uri.startsWith("/api/auth/")
                || uri.startsWith("/api/public/")
                // 어드민/멘토 테스트
                // || uri.startsWith("/api/admin/")
                // || uri.startsWith("/api/mentor/")
                || uri.startsWith("/api/community/")
                || uri.startsWith("/api/survey/")
                || uri.startsWith("/api/policy/")
                || uri.startsWith("/api/dashboard/")
                || uri.startsWith("/api/recommendation");
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AuthConstants.AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(AuthConstants.TOKEN_PREFIX)) {
            return bearerToken.substring(AuthConstants.TOKEN_PREFIX.length());
        }
        return null;
    }
}
