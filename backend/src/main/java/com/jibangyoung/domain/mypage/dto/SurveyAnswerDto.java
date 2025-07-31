// dto/SurveyAnswerDto.java
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
public class SurveyAnswerDto {
    private Long answerId;
    private Long responseId;
    private Long userId;
    private String questionId;
    private String optionCode;
    private String answerText;
    private Double answerWeight;
    private LocalDateTime submittedAt;
}