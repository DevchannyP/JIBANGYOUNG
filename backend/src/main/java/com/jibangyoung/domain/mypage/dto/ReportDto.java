package com.jibangyoung.domain.mypage.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReportDto {
    private Long id;
    private String type;
    private String targetTitle;
    private String reason;
    private String reportedAt;
    private String status;
}
