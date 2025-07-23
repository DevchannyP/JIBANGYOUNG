package com.jibangyoung.domain.mypage.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CommentPreviewDto {
    private Long id;
    private String content;
    private String targetPostTitle;
    private String createdAt;
}
