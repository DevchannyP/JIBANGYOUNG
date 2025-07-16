package com.jibangyoung.domain.community.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCreateRequestDto {
    @NotBlank(message = "재목은 필수로 기입해주세요.")
    private String title;
    private String content;
    private String tag;
    private boolean isNotice;
    private boolean isMentorOnly;
}
