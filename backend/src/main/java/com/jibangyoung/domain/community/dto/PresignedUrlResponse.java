package com.jibangyoung.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PresignedUrlResponse {
    private String url; // presigned URL
    private String publicUrl; // 실제 이미지 접근 경로 (src로 사용될 값)
}