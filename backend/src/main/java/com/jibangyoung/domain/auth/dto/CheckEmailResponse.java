package com.jibangyoung.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class CheckEmailResponse {
        private boolean data;   // true: 사용 가능, false: 중복
    private String message;
}