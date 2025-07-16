package com.jibangyoung.domain.community.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostListDto {
    private String title;
    private int likes;
    private int views;
    private LocalDateTime createdAt;
    // private Long userId;
    private Long regionId;
}
