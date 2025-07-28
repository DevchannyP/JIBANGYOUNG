package com.jibangyoung.domain.recommendation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "infra_data")
@Data
public class InfraData {

    @Id
    @Column(name = "region_code", length = 10)
    private String regionCode; // 시군구코드 (행정구역코드)

    // 집값 관련 정보
    @Column(name = "housing_price_score")
    private Double housingPriceScore; // 집값점수 (정규화된 값)

    @Column(name = "housing_price_group", length = 1)
    private String housingPriceGroup; // 집값그룹 (A~E 등급)

    // 의료 인프라 관련 정보
    @Column(name = "medical_infra_score")
    private Integer medicalInfraScore; // 의료인프라점수

    @Column(name = "medical_infra_grade", length = 1)
    private String medicalInfraGrade; // 의료인프라등급 (A~E 등급)

    // 교통 인프라 관련 정보
    @Column(name = "transport_infra_score")
    private Double transportInfraScore; // 교통인프라점수

    @Column(name = "transport_infra_grade", length = 1)
    private String transportInfraGrade; // 교통인프라등급 (A~E 등급)

    // 접근성 관련 정보
    @Column(name = "medical_accessibility_index")
    private Integer medicalAccessibilityIndex; // 의료접근성지수

    @Column(name = "accessibility_group", length = 1)
    private String accessibilityGroup; // 접근성지수그룹 (A~E 등급)

    // 종합 점수
    @Column(name = "total_infra_score")
    private Double totalInfraScore; // 인프라 점수 합계
}