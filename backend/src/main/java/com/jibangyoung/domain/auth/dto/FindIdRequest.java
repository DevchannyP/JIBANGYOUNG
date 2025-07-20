package com.jibangyoung.domain.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FindIdRequest {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String code;
}