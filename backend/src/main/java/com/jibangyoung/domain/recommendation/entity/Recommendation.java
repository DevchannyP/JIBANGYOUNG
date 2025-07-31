package com.jibangyoung.domain.recommendation.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 고유값

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // 생성 시간. 로그용

    @Column(name = "region_code", nullable = false, length = 20)
    private String regionCode; // 추천된 지역 코드, 인프라 데이터 기반

    @Column(name = "policy_code", nullable = false, length = 50)
    private Integer policyCode; // 추천된 정책 코드, policy 데이터 기반

    @Column(name = "response_id", nullable = false)
    private Long responseId; // survey_answers 테이블의 response_id와 매핑

    @Column(name = "user_id", nullable = false)
    private Long userId; // survey_answers 테이블의 userid와 매핑

    @Column(name = "is_viewed", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0") // 디폴트 : false
    private boolean isViewed; // 일회용 페이지로 만들기 위한 논리적 삭제

    @Column(name = "rankgroup")
    private Integer rankGroup; // 추천 지역 순위 그룹

    @Column(name = "rank")
    private Integer rank; // 추천 지역 내 정책 순위
}