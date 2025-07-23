package com.jibangyoung.domain.mypage.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AlertDto {
    private Long id;
    private String region;
    private String message;
    private String createdAt;
    private boolean isRead;
}
