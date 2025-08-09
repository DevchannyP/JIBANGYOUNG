package com.jibangyoung.domain.community.support;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class S3ImageManager {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private static final Pattern IMG_TAG_PATTERN = Pattern.compile("<img[^>]+src=\"([^\"]+)\"");

    // 본문에서 temp/ 이미지를 사용한 URL 추출
    public List<String> extractUsedTempImageKeys(String htmlContent) {
        List<String> images = new ArrayList<>();
        if (htmlContent == null || htmlContent.isBlank()) return images;

        Matcher matcher = IMG_TAG_PATTERN.matcher(htmlContent);
        while (matcher.find()) {
            String url = matcher.group(1);
            if (url.contains("/temp/")) {
                int idx = url.indexOf("/temp/");
                images.add(url.substring(idx + 1)); // 예: temp/abc.jpg
            }
        }
        return images;
    }

    // 본문에서 첫 번째 이미지 URL 추출 (썸네일용)
    public String extractFirstImageUrl(String htmlContent) {
        if (htmlContent == null || htmlContent.isBlank()) return null;

        Matcher matcher = IMG_TAG_PATTERN.matcher(htmlContent);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    // 현재 S3의 temp/ 경로에 존재하는 모든 객체 키 조회
    public List<String> getAllTempImageKeys() {
        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(bucket)
                .prefix("temp/")
                .build();

        ListObjectsV2Response response = s3Client.listObjectsV2(request);

        return response.contents().stream()
                .map(S3Object::key)
                .collect(Collectors.toList());
    }

    // 지정된 key의 S3 객체 삭제
    public void deleteObject(String key) {
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        s3Client.deleteObject(request);
    }

    // temp/ -> post-images/로 복사
    public void copyObject(String sourceKey, String targetKey) {
        CopyObjectRequest copyRequest = CopyObjectRequest.builder()
                .sourceBucket(bucket)
                .sourceKey(sourceKey)
                .destinationBucket(bucket)
                .destinationKey(targetKey)
                .build();

        s3Client.copyObject(copyRequest);
    }


    public String getPublicUrl(String key) {
        return "https://" + bucket + ".s3.ap-northeast-2.amazonaws.com/" + key;
    }

    // HTML 콘텐츠에서 S3 이미지 키 추출 (삭제용)
    public List<String> extractImageKeysFromContent(String htmlContent) {
        List<String> imageKeys = new ArrayList<>();
        if (htmlContent == null || htmlContent.isBlank()) {
            return imageKeys;
        }

        String bucketUrl = "https://" + bucket + ".s3.ap-northeast-2.amazonaws.com/";
        Matcher matcher = IMG_TAG_PATTERN.matcher(htmlContent);
        
        while (matcher.find()) {
            String imageUrl = matcher.group(1);
            if (imageUrl.startsWith(bucketUrl)) {
                String key = imageUrl.substring(bucketUrl.length());
                // post-images/ 또는 temp/ 경로만 삭제 대상으로 함
                if (key.startsWith("post-images/") || key.startsWith("temp/")) {
                    imageKeys.add(key);
                }
            }
        }
        
        return imageKeys;
    }
}
