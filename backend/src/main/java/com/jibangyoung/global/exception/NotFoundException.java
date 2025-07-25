package com.jibangyoung.global.exception;

/**
 * [글로벌 NotFoundException]
 * - ErrorCode 기반
 * - 도메인 NotFound도 모두 이 클래스를 통해 통일 (User, Post, Alert 등)
 */
public class NotFoundException extends BaseException {
    // 기본 "NOT_FOUND" 에러코드 사용
    public NotFoundException() {
        super(ErrorCode.NOT_FOUND);
    }

    // 상세 메시지 커스텀 지원 (ex: "사용자를 찾을 수 없습니다.")
    public NotFoundException(String detailMessage) {
        super(ErrorCode.NOT_FOUND, detailMessage);
    }

    // 도메인별 세분화 코드(원하면 추가 가능)
    public NotFoundException(ErrorCode code) {
        super(code);
    }
    public NotFoundException(ErrorCode code, String detailMessage) {
        super(code, detailMessage);
    }
}
