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
        // request 객체에서 userId와 answers 추출
        Long userId = request.getUserId();
        var answers = request.getAnswers();

        Long responseId = service.saveSurveyAnswers(userId, answers);

        Map<String, Long> body = Map.of(
                "userId", userId,
                "responseId", responseId);

        return ResponseEntity.ok(body);
    }
}
