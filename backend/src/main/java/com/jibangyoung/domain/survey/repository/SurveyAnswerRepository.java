package com.jibangyoung.domain.survey.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jibangyoung.domain.survey.entity.SurveyAnswer;

import io.lettuce.core.dynamic.annotation.Param;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer, Long> {
    // List<SurveyAnswer> findByResponseId(Long responseId);

    // Optional<Long>: "값이 있을 수도 있고 없을 수도 있는 Long"을 표현하는 Java 8의 Optional 클래스 타입
    @Query("SELECT MAX(sa.responseId) FROM SurveyAnswer sa WHERE sa.userId = :userId")
    Optional<Long> findMaxResponseIdByUserId(@Param("user_id") Long userId);

    // surveyAnswer 결과를 recommendationService로 전달
    List<SurveyAnswer> findByUserIdAndResponseId(Long userId, Long responseId);
}