package com.jibangyoung.domain.mypage.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PostPreviewDto {
    private Long id;
    private String title;
    private String region;
    private String createdAt;
}
