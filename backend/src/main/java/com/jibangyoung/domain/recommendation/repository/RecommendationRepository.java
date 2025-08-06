package com.jibangyoung.domain.recommendation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jibangyoung.domain.recommendation.dto.PolicyScoreDto;
import com.jibangyoung.domain.recommendation.dto.RecommendedRegionDto;
import com.jibangyoung.domain.recommendation.entity.Recommendation;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

        // 전체 정책의 분석용 칼럼을 담은 PolicyScoreDto
        @Query("SELECT new com.jibangyoung.domain.recommendation.dto.PolicyScoreDto(" +
                        "p.NO, p.zip_cd, p.sprt_trgt_min_age, p.sprt_trgt_max_age, p.school_cd, " +
                        "p.s_biz_cd, p.mrg_stts_cd, p.job_cd, p.lclsf_nm, p.mclsf_nm, 0.0) " + // 0.0은 더미 값
                        "FROM Policy p")
        List<PolicyScoreDto> getAlgoColumn();

        // 전체 인프라 등급 정보와 인프라 score 칼럼을 가진 RecommendedRegionDto
        @Query("SELECT new com.jibangyoung.domain.recommendation.dto.RecommendedRegionDto(" +
                        "r.regionCode, r.medicalInfraGrade, r.accessibilityGroup, r.transportInfraGrade, " +
                        "r.housingPriceGroup, 0.0) " +
                        "FROM InfraData r")
        List<RecommendedRegionDto> findAllInfraData();

        // userid, responseid에 맞는 추천 지역의 추천 정책 리스트 조회
        List<Recommendation> findByUserIdAndResponseId(Long userId, Long responseId);

        // 인프라 등급 리스트 반환
        @Query("""
                            SELECT r.medicalInfraGrade, r.accessibilityGroup, r.transportInfraGrade, r.housingPriceGroup
                            FROM InfraData r
                            WHERE r.regionCode = :regionCodeStr
                        """)
        List<Object[]> getDescriptionByGrade(@Param("regionCodeStr") String regionCodeStr);

        // user의 추천 정책 전체 로드
        List<Recommendation> findByUserId(Long userId);
}
