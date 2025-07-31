package com.jibangyoung.domain.mypage.exception;

import com.jibangyoung.global.exception.BaseException;
import com.jibangyoung.global.exception.ErrorCode;

/**
 * [실무] 마이페이지 도메인 전용 예외
 * - 코드/메시지 일원화, 유지보수 최적화
 */
public class MyPageException extends BaseException {
    public MyPageException(ErrorCode errorCode) {
        super(errorCode);
    }

    public MyPageException(ErrorCode errorCode, String detail) {
        super(errorCode, detail);
    }

}