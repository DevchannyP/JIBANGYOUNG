package com.jibangyoung.global.exception;

import lombok.Getter;

/**
 * [글로벌 베이스 예외]
 * - 모든 도메인 Exception이 상속, ErrorCode + message + 상세 메시지
 */
@Getter
public abstract class BaseException extends RuntimeException {
    private final ErrorCode errorCode;
    private final String detailMessage;

    public BaseException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.detailMessage = null;
    }

    public BaseException(ErrorCode errorCode, String detailMessage) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.detailMessage = detailMessage;
    }
}
