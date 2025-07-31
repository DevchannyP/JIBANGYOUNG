package com.jibangyoung.domain.dashboard.exception;

public class RegionDashException extends RuntimeException {
    public RegionDashException(String message) {
        super(message);
    }

    public RegionDashException(String message, Throwable cause) {
        super(message, cause);
    }
}
