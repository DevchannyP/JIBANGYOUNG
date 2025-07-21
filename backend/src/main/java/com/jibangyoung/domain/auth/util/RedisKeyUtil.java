package com.jibangyoung.domain.auth.util;

/**
 * 레디스 키 네이밍 전략
 */
public class RedisKeyUtil {
    public static String passwordResetTokenKey(String email) {
        return "pwreset:" + email;
    }
}
