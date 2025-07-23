package com.jibangyoung.domain.mypage.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSurveyDto {
    private Long id;
    private String title;
    private boolean isFavorite;
    private String participatedAt;
    private String resultUrl;
}
