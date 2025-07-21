package com.jibangyoung.domain.auth.exception;

import com.jibangyoung.global.exception.ErrorCode;
import lombok.Getter;

@Getter
public class PasswordResetException extends RuntimeException {
    private final ErrorCode errorCode;

    public PasswordResetException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
