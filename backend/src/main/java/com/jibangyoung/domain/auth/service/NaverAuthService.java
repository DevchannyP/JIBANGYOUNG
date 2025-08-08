package com.jibangyoung.domain.auth.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.jibangyoung.domain.auth.dto.LoginResponseDto;
import com.jibangyoung.domain.auth.dto.SocialLoginRequestDto;
import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.entity.UserRole;
import com.jibangyoung.domain.auth.oauth.NaverOAuth2UserInfo;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.global.exception.BusinessException;
import com.jibangyoung.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NaverAuthService {

    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.naver.redirect-uri}")
    private String redirectUri;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final SecureRandom secureRandom = new SecureRandom();

    /** 네이버 인증 URL 생성 */
    public String getAuthorizationUrl() {
        String state = generateSecureState();
        String encodedRedirect = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
        String encodedState = URLEncoder.encode(state, StandardCharsets.UTF_8);

        return String.format(
                "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=%s&redirect_uri=%s&state=%s",
                clientId, encodedRedirect, encodedState);
    }

    private String generateSecureState() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /** 콜백 처리 */
    public LoginResponseDto processCallback(String code, String state) {
        String accessToken = getNaverAccessToken(code, state);
        NaverOAuth2UserInfo info = getNaverUserInfo(accessToken);

        SocialLoginRequestDto dto = SocialLoginRequestDto.builder()
                .providerId(info.getProviderId())
                .email(info.getEmail())
                .nickname(info.getName())
                .name(info.getName())
                .profileImageUrl(info.getImageUrl())
                .gender(info.getGender())
                .birthDate(info.getFullBirthDate())
                .phone(info.getPhone())
                .build();

        User user = processOrCreateUser(dto);
        Authentication auth = createAuthentication(user);
        LoginResponseDto tokens = tokenService.generateTokens(auth, user);
        user.updateLastLogin();
        return tokens;
    }

    public LoginResponseDto processSocialLogin(SocialLoginRequestDto request) {
        User user = processOrCreateUser(request);
        Authentication auth = createAuthentication(user);
        LoginResponseDto tokens = tokenService.generateTokens(auth, user);
        user.updateLastLogin();
        return tokens;
    }

    /** 기존/신규 사용자 처리 */
    private User processOrCreateUser(SocialLoginRequestDto request) {
        String username = "naver_" + request.getProviderId();
        Optional<User> existing = userRepository.findByUsername(username);
        if (existing.isPresent())
            return existing.get();

        String email = (request.getEmail() != null && !request.getEmail().isBlank())
                ? request.getEmail()
                : username + "@social.jibangyoung.com";
        if (userRepository.existsByEmail(email)) {
            email = username + "@social.jibangyoung.com";
        }

        String nickname = (request.getNickname() != null && !request.getNickname().isBlank())
                ? request.getNickname()
                : (request.getName() != null && !request.getName().isBlank()
                        ? request.getName()
                        : "네이버사용자_" + request.getProviderId().substring(0,
                                Math.min(8, request.getProviderId().length())));

        User newUser = User.createUser(
                username,
                email,
                passwordEncoder.encode(generateSecureRandomPassword()),
                nickname,
                request.getPhone(),
                request.getProfileImageUrl(),
                parseBirthDate(request.getBirthDate()),
                request.getGender(),
                null,
                UserRole.USER);

        return userRepository.save(newUser);
    }

    /** 🔧 FIX 1: Access Token 획득 - redirect_uri 제거 및 에러 필드 보강 */
    private String getNaverAccessToken(String code, String state) {
        String tokenUrl = "https://nid.naver.com/oauth2.0/token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("code", code);
        params.add("state", state);
        // ⛔️ 기존 코드: params.add("redirect_uri", redirectUri);
        // 네이버 토큰 발급에서 redirect_uri는 필수 아님. 값 불일치 시 오류 가능 → 제거.

        HttpEntity<MultiValueMap<String, String>> req = new HttpEntity<>(params, headers);
        ResponseEntity<Map> res = restTemplate.postForEntity(tokenUrl, req, Map.class);

        if (res.getStatusCode() != HttpStatus.OK || res.getBody() == null) {
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR, "네이버 토큰 획득 실패");
        }

        // 응답 바디의 에러 필드 점검
        Object error = res.getBody().get("error");
        if (error != null) {
            String desc = String.valueOf(res.getBody().get("error_description"));
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR, "네이버 토큰 오류: " + error + " / " + desc);
        }

        String token = (String) res.getBody().get("access_token");
        if (!org.springframework.util.StringUtils.hasText(token)) {
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR, "네이버 토큰이 없습니다");
        }
        return token;
    }

    /** 🔧 FIX 2: 사용자 정보 조회 - Authorization 헤더가 실제 '헤더'로 들어가도록 수정 */
    private NaverOAuth2UserInfo getNaverUserInfo(String accessToken) {
        String url = "https://openapi.naver.com/v1/nid/me";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        // 기존 문제: new HttpEntity<>(headers) → 헤더가 바디로 들어감.
        // 올바른 형태: 바디(null), 헤더(headers)로 분리해 생성
        HttpEntity<Void> req = new HttpEntity<>(null, headers);

        ResponseEntity<Map> res = restTemplate.exchange(url, HttpMethod.GET, req, Map.class);

        if (res.getStatusCode() != HttpStatus.OK || res.getBody() == null) {
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR, "네이버 사용자 정보 조회 실패");
        }
        String resultCode = String.valueOf(res.getBody().get("resultcode"));
        if (!"00".equals(resultCode)) {
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR, "네이버 사용자 정보 응답 오류: " + resultCode);
        }
        return new NaverOAuth2UserInfo(res.getBody());
    }

    /** 랜덤 비밀번호 */
    private String generateSecureRandomPassword() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    /** 생년월일 파싱 */
    private LocalDate parseBirthDate(String birthDate) {
        if (birthDate == null || birthDate.isBlank())
            return null;
        try {
            if (birthDate.matches("\\d{4}-\\d{2}-\\d{2}")) {
                String[] parts = birthDate.split("-");
                return LocalDate.of(
                        Integer.parseInt(parts[0]),
                        Integer.parseInt(parts[1]),
                        Integer.parseInt(parts[2]));
            } else if (birthDate.matches("\\d{4}")) {
                return LocalDate.of(Integer.parseInt(birthDate), 1, 1);
            }
        } catch (Exception e) {
            log.warn("생년월일 파싱 실패: {}", birthDate);
        }
        return null;
    }

    /** Authentication 생성 */
    private Authentication createAuthentication(User user) {
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(user.getRole().toGrantedAuthority());
        return new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);
    }
}
