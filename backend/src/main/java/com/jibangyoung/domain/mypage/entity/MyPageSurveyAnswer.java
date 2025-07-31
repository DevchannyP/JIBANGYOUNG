package com.jibangyoung.domain.mypage.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 설문 응답 엔티티 (survey_answers)
 * - MariaDB 테이블과 100% 동일하게 snake_case 컬럼명 매핑
 * - 인덱스 포함, 실무 네이밍 완벽 일치
 */
@Entity
@Table(name = "survey_answers", indexes = {
        @Index(name = "idx_response_user", columnList = "response_id, user_id"),
        @Index(name = "idx_user", columnList = "user_id")
})
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyPageSurveyAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id") // ✅ PK 컬럼명 명확히 지정
    private Long answerId;

    @Column(name = "response_id", nullable = false)
    private Long responseId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "question_id", nullable = false, length = 20)
    private String questionId;

    @Column(name = "option_code", length = 30)
    private String optionCode;

    @Column(name = "answer_text", length = 255)
    private String answerText;

    @Column(name = "answer_weight")
    private Double answerWeight;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
}
