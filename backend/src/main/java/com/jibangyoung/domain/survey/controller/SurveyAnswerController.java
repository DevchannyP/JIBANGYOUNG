package com.jibangyoung.domain.survey.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.survey.dto.AnswerJsonDto;
import com.jibangyoung.domain.survey.service.SurveyAnswerService;
import com.jibangyoung.global.security.CustomUserPrincipal; // ★ 주의: 직접 principal 타입 지정

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/survey")
@RequiredArgsConstructor
public class SurveyAnswerController {

    private final SurveyAnswerService service;

    // 설문 응답 저장 (로그인 유저만)
    @PostMapping("/surveyAnswer")
    public ResponseEntity<Map<String, Long>> saveAnswers(
            @AuthenticationPrincipal CustomUserPrincipal principal, // 인증 객체 주입
            @RequestBody AnswerJsonDto request) {

        Long userId = principal.getId(); // 인증된 사용자 ID
        var answers = request.getAnswers();

        Long responseId = service.saveSurveyAnswers(userId, answers);

        Map<String, Long> body = Map.of(
                "userId", userId,
                "responseId", responseId);

        return ResponseEntity.ok(body);
    }
}
