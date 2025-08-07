package com.jibangyoung.domain.community.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostUpdateRequestDto {

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    private String content;
    private String category; // "FREE", "QUESTION", "SETTLEMENT_REVIEW", "NOTICE" 등 문자열 입력
    
    private boolean isNotice;
    private boolean isMentorOnly;
}