package com.jibangyoung.global.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // [공통] 시스템/입력 에러
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "내부 서버 오류가 발생했습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "INVALID_INPUT_VALUE", "입력값이 올바르지 않습니다."),

    // [공통] 리소스 없음 (범용)
    NOT_FOUND(HttpStatus.NOT_FOUND, "NOT_FOUND", "리소스를 찾을 수 없습니다."),

    // [인증/유저] 관련 에러
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "존재하지 않는 계정입니다."),
    INVALID_LOGIN_CREDENTIALS(HttpStatus.UNAUTHORIZED, "INVALID_LOGIN_CREDENTIALS", "아이디 또는 비밀번호가 올바르지 않습니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "INVALID_PASSWORD", "비밀번호가 올바르지 않습니다."),
    PASSWORD_MISMATCH(HttpStatus.BAD_REQUEST, "PASSWORD_MISMATCH", "비밀번호가 일치하지 않습니다."),
    ACCOUNT_LOCKED(HttpStatus.FORBIDDEN, "ACCOUNT_LOCKED", "계정이 잠겨있습니다."),
    ACCOUNT_DEACTIVATED(HttpStatus.FORBIDDEN, "ACCOUNT_DEACTIVATED", "비활성화된 계정입니다."),
    USERNAME_ALREADY_EXISTS(HttpStatus.CONFLICT, "USERNAME_ALREADY_EXISTS", "이미 존재하는 사용자명입니다."),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS", "이미 등록된 이메일입니다."),

    // [토큰] 관련 에러
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "EXPIRED_TOKEN", "만료된 토큰입니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN", "유효하지 않은 리프레시 토큰입니다."),
    EXPIRED_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "EXPIRED_REFRESH_TOKEN", "만료된 리프레시 토큰입니다."),

    // [비밀번호 재설정/인증코드]
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "TOKEN_INVALID", "유효하지 않은 토큰입니다."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "TOKEN_EXPIRED", "토큰이 만료되었거나 이미 사용되었습니다."),

    // [권한] 관련 에러
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "ACCESS_DENIED", "접근 권한이 없습니다."),
    INSUFFICIENT_PRIVILEGES(HttpStatus.FORBIDDEN, "INSUFFICIENT_PRIVILEGES", "권한이 부족합니다."),

    // [이메일]
    EMAIL_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "EMAIL_SEND_FAILED", "메일 발송에 실패했습니다."),

    // [마이페이지/알림]
    MYPAGE_NOT_FOUND(HttpStatus.NOT_FOUND, "MYPAGE_NOT_FOUND", "마이페이지 정보를 찾을 수 없습니다."),
    ALERT_NOT_FOUND(HttpStatus.NOT_FOUND, "ALERT_NOT_FOUND", "알림을 찾을 수 없습니다."),

    // [커뮤니티/게시글]
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "POST_NOT_FOUND", "게시글을 찾을 수 없습니다."),
    ALREADY_RECOMMENDED(HttpStatus.CONFLICT, "ALREADY_RECOMMENDED", "이미 추천한 게시글입니다."),

    // [멘토]
    ALREADY_APPLIED_MENTOR(HttpStatus.CONFLICT, "ALREADY_APPLIED_MENTOR", "이미 멘토 신청을 하셨습니다."),
    NOTICE_NOT_MENTOR(HttpStatus.CONFLICT, "NOTICE_NOT_MENTOR", "공지사항을 찾을 수 없습니다."),

    // [소셜 로그인/외부 API]
    SOCIAL_LOGIN_FAILED(HttpStatus.BAD_REQUEST, "SOCIAL_001", "소셜 로그인 처리 실패"),
    EXTERNAL_API_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "EXTERNAL_001", "외부 API 호출 오류");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
