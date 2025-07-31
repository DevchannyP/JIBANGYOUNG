package com.jibangyoung.domain.mypage.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SurveyResponseGroupDto {
    private Long responseId;
    private Long userId;
    private int answerCount;
    private LocalDateTime submittedAt;
}