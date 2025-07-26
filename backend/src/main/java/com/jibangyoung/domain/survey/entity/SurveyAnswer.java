package com.jibangyoung.domain.survey.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "survey_answers", indexes = {
    @Index(name = "idx_response_id", columnList = "response_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_question_id", columnList = "question_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyAnswer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long answerId;
    
    @Column(name = "response_id", nullable = false)
    private Long responseId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "question_id", nullable = false, length = 20)
    private String questionId;
    
    // 기존 answer_value 대신 아래 컬럼들로 변경
    @Column(name = "option_code", nullable = false)
    private String optionCode;
    
    @Column(name = "answer_text", nullable = false, length = 255)
    private String answerText;
    
    @Column(name = "answer_weight", nullable = false)
    private float answerWeight;
    
    @CreationTimestamp
    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt;
}
