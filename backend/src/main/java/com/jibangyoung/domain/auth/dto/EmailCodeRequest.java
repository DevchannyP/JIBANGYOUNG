package com.jibangyoung.domain.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class EmailCodeRequest {
    @NotBlank @Email
    private String email;
    @NotBlank
    private String code;
}
