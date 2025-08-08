package com.jibangyoung.domain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialLoginStatusDto {
    private boolean isSocialLogin;
    private String provider;
    private boolean canChangePassword;
}