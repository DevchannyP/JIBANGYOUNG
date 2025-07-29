package com.jibangyoung.domain.mentor.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "mentor_profiles_test") // DB 테이블명
@Getter
@Setter
public class MentorTest {

    @Id
    @Column(name = "id")
    private Long id; // BIGINT

    @Column(name = "level_acquired_at")
    private LocalDateTime levelAcquiredAt; // DATETIME

    @Column(name = "current_score")
    private Integer currentScore; // INT

    @Column(name = "warning_count")
    private Integer warningCount; // INT

    @Column(name = "is_certified_by_public")
    private Boolean isCertifiedByPublic; // BOOLEAN

    @Column(name = "is_active")
    private Boolean isActive; // BOOLEAN

    @Column(name = "created_at")
    private LocalDateTime createdAt; // DATETIME

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // DATETIME

    @Column(name = "region_id")
    private Long regionId; // BIGINT

    @Column(name = "user_id")
    private Long userId; // BIGINT

    @Column(name = "level_code", length = 30)
    private String levelCode; // VARCHAR(30)
}
