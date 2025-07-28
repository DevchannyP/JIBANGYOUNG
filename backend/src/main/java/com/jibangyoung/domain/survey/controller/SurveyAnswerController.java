package com.jibangyoung.domain.survey.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.survey.dto.AnswerJsonDto;
import com.jibangyoung.domain.survey.service.SurveyAnswerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/survey")
@RequiredArgsConstructor
public class SurveyAnswerController {

    private final SurveyAnswerService service;

    // 설문 응답 저장
    @PostMapping("/surveyAnswer")
    public ResponseEntity<Map<String, Long>> saveAnswers(@RequestBody AnswerJsonDto request) {
        Long userId = 1001L; // 로그인 사용자 ID
        Long responseId = service.saveSurveyAnswers(userId, request.getAnswers());

        Map<String, Long> body = Map.of(
                "userId", userId,
                "responseId", responseId);

        return ResponseEntity.ok(body);
    }
}
