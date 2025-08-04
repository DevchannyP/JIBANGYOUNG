package com.jibangyoung.domain.community.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecommendationRequestDto {
    @NotBlank(message = "추천 타입은 필수입니다.")
    private String type;
}
