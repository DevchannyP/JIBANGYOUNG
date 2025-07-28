package com.jibangyoung.domain.community.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PresignedUrlRequest {
    private String fileName;      // 예: post-uuid.jpg
    private String contentType;   // 예: image/jpeg
}