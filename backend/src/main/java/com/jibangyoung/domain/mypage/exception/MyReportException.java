package com.jibangyoung.domain.mypage.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 내 신고 이력 도메인 전용 예외
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MyReportException extends RuntimeException {
    public MyReportException(String message) {
        super(message);
    }
}
