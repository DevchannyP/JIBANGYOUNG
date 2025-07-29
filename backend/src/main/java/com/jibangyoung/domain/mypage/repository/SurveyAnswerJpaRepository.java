// repository/SurveyAnswerJpaRepository.java
package com.jibangyoung.domain.mypage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.mypage.entity.MyPageSurveyAnswer;

public interface SurveyAnswerJpaRepository extends JpaRepository<MyPageSurveyAnswer, Long> {
    List<MyPageSurveyAnswer> findByResponseId(Long responseId);
}
