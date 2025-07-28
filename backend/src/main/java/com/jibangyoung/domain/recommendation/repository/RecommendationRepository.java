package com.jibangyoung.domain.recommendation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jibangyoung.domain.recommendation.dto.PolicyScoreDto;
import com.jibangyoung.domain.recommendation.entity.Recommendation;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    List<Recommendation> findByUserIdAndResponseId(Long userId, Long responseId);

    // 전체 정책의 분석용 칼럼을 담은 PolicyScoreDto
    @Query("SELECT new com.jibangyoung.domain.policy.dto.PolicyScoreDto(" +
            "p.plcy_no, p.sprt_trgt_min_age, p.sprt_trgt_max_age, " +
            "p.school_cd, p.s_biz_cd, p.mrg_stts_cd, p.job_cd, " +
            "p.lclsf_nm, p.mclsf_nm) " +
            "FROM Policy p")
    List<PolicyScoreDto> getAlgoColumn();
}