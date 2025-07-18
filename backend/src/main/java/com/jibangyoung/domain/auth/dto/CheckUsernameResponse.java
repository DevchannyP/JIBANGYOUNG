package com.jibangyoung.domain.auth.dto;

import lombok.*;

@Getter @Builder
public class CheckUsernameResponse {
    private boolean data;   // true: 사용 가능, false: 중복
    private String message;
}