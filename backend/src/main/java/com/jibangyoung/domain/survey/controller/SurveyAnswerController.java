package com.jibangyoung.domain.survey.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.jibangyoung.domain.survey.service.SurveyAnswerService;

import java.util.Map;

@RestController
@RequestMapping("/api/survey")
@RequiredArgsConstructor
public class SurveyAnswerController {

    private final SurveyAnswerService service;

    // 설문 응답 저장
    @PostMapping("/answers")
    public String saveAnswers(@RequestBody Map<String, Object> request) {
        Long userId = 1001L;  // TODO: 실제 로그인 사용자 ID로 변경
        Map<String, Object> answers = (Map<String, Object>) request.get("answers");

        service.saveSurveyAnswers(userId, answers);
        return "설문 응답이 저장되었습니다.";
    }
}
