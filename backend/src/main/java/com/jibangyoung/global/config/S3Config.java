package com.jibangyoung.global.config;

import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class S3Config {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.region.static}")
    private String region;

    private S3Presigner presigner;
    private S3Client s3Client;

    // S3 Client
    @Bean
    public S3Client s3Client() {
        AwsCredentialsProvider credentialsProvider = StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)
        );
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(credentialsProvider)
                .build();
        return this.s3Client;
    }

    // Presigned URL
    @Bean
    public S3Presigner s3Presigner() {
        if (this.presigner == null) {
            AwsCredentialsProvider credentialsProvider = StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(accessKey, secretKey)
            );
            this.presigner = S3Presigner.builder()
                    .region(Region.of(region))
                    .credentialsProvider(credentialsProvider)
                    .build();
        }
        return this.presigner;
    }

    @PreDestroy
    public void shutdown() {
        if (this.presigner != null) {
            this.presigner.close();
        }
        if (this.s3Client != null) {
            this.s3Client.close();
        }
    }
}
