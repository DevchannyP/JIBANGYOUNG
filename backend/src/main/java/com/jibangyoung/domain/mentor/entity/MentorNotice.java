package com.jibangyoung.domain.mentor.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mentor_notices")
public class MentorNotice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 공지 제목
    @Column(nullable = false, length = 200)
    private String title;

    // 공지 내용
    @Lob
    @Column(nullable = false)
    private String content;

    // 작성자 (관리자 ID)
    @Column(name = "author_id", nullable = false)
    private Long authorId;

    // 지역 FK
    @Column(name = "region_id", nullable = false)
    private Integer regionId;

    // 생성 일시
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 수정 일시
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Column(name = "file_url")
    private String fileUrl;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}