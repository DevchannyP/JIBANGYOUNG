package com.jibangyoung.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCreateRequestDto {
    private String title;
    private String content;
    private String tag;
    private boolean isNotice;
    private boolean isMentorOnly;
}
