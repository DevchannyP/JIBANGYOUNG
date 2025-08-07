package com.jibangyoung.domain.admin.dto;


import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
// 게시글관리_조회
public class AdPostDTO {
    private Long id;
    private String title;
    private Long user_id;
    private LocalDateTime created_at;
    private Long region_id;
    private int views;
    private int likes;
    private String nickname;
    private boolean isDeleted;
}