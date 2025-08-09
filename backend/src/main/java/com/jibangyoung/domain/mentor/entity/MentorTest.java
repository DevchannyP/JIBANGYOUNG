package com.jibangyoung.domain.mentor.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "mentor_profiles") // DB 테이블명
@Getter
@Setter
public class MentorTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "level_acquired_at")
    private LocalDateTime levelAcquiredAt; // 등급 획득일

    @Column(name = "current_score")
    private Integer currentScore; // 활동 점수

    @Column(name = "warning_count")
    private Integer warningCount; // 경고 누적횟수

    @Column(name = "is_certified_by_public")
    private Boolean isCertifiedByPublic; // 공개 인증 여부

    @Column(name = "is_active")
    private Boolean isActive; // 활성화 여부

    @Column(name = "created_at")
    private LocalDateTime createdAt; // 생성일시

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 수정일시

    @Column(name = "region_id")
    private Long regionId; // 지역코드

    @Column(name = "user_id")
    private Long userId; // 유저 아이디
}
