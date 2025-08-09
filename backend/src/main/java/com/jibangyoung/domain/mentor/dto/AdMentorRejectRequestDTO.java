package com.jibangyoung.domain.mentor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AdMentorRejectRequestDTO {
    @Size(max = 255) // DB 길이 초과 방지
    @NotBlank
    private String reason;
}
