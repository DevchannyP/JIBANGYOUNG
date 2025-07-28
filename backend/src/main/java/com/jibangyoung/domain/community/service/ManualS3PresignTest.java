package com.jibangyoung.domain.community.service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;

public class ManualS3PresignTest {
    public static void main(String[] args) throws Exception {
        // 1. 환경 변수 or 하드코딩 (임시)
        String accessKey = "AKIA3ADY3G2JK5PFTCED";
        String secretKey = "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";
        String region = "ap-northeast-2";
        String bucket = "jibangyoung-s3";
        String fileName = "test/manual-upload.png";
        String contentType = "image/png";

        // 2. presigner 직접 생성
        S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey))
                )
                .build();

        // 3. presign URL 발급
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(fileName)
                .contentType(contentType)
                //.acl("public-read") // 필요 시 주석 해제
                .build();
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(3))
                .putObjectRequest(objectRequest)
                .build();

        String presignedUrl = presigner.presignPutObject(presignRequest).url().toString();
        System.out.println("Presigned URL: " + presignedUrl);

        // 4. 임시파일 생성 (PNG 헤더만 넣기)
        Path tempFile = Files.createTempFile("manual-upload", ".png");
        Files.write(tempFile, new byte[]{(byte)0x89, 0x50, 0x4E, 0x47});

        // 5. 실제 S3에 PUT 업로드
        URL url = new URL(presignedUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setDoOutput(true);
        connection.setRequestMethod("PUT");
        connection.setRequestProperty("Content-Type", contentType);
        Files.copy(tempFile, connection.getOutputStream());
        int responseCode = connection.getResponseCode();
        System.out.println("S3 PUT 응답 코드: " + responseCode); // 200이면 성공

        // 6. 정리
        Files.deleteIfExists(tempFile);
        presigner.close();
    }
}
