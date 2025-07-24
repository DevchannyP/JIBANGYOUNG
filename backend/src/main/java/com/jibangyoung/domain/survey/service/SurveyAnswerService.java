package com.jibangyoung.domain.survey.service;

import com.jibangyoung.domain.survey.entity.SurveyAnswer;
import com.jibangyoung.domain.survey.repository.SurveyAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SurveyAnswerService {

    private final SurveyAnswerRepository repository;

    @Transactional
    public void saveSurveyAnswers(Long userId, Map<String, Object> answers) {
        // responseId 생성 로직 필요 (여기서는 임의로 1L 고정, 실제론 UUID나 시퀀스 등)
        Long responseId = 1L;  

        List<SurveyAnswer> saveList = new ArrayList<>();

        for (Map.Entry<String, Object> entry : answers.entrySet()) {
            String questionCode = entry.getKey();
            Object answerObj = entry.getValue();

            if (answerObj instanceof Map) {
                // 단일 답변 (AnswerObject)
                Map<String, Object> ans = (Map<String, Object>) answerObj;
                SurveyAnswer sa = buildSurveyAnswer(userId, responseId, questionCode, ans);
                saveList.add(sa);

            } else if (answerObj instanceof List) {
                // 복수 답변 (List<AnswerObject>)
                List<Map<String, Object>> ansList = (List<Map<String, Object>>) answerObj;
                for (Map<String, Object> ans : ansList) {
                    SurveyAnswer sa = buildSurveyAnswer(userId, responseId, questionCode, ans);
                    saveList.add(sa);
                }
            }
        }
        repository.saveAll(saveList);
    }

    private SurveyAnswer buildSurveyAnswer(Long userId, Long responseId, String questionCode, Map<String, Object> ans) {
        SurveyAnswer surveyAnswer = new SurveyAnswer();
        surveyAnswer.setUserId(userId);
        surveyAnswer.setResponseId(responseId);
        surveyAnswer.setQuestionId(questionCode);

        // option_code는 int 타입인데 프론트에서 string 올 수 있으니 변환 처리
        Object optionCodeObj = ans.get("option_code");
        int optionCode = 0;
        if (optionCodeObj instanceof String) {
            optionCode = Integer.parseInt((String) optionCodeObj);
        } else if (optionCodeObj instanceof Number) {
            optionCode = ((Number) optionCodeObj).intValue();
        }
        surveyAnswer.setOptionCode(optionCode);

        surveyAnswer.setAnswerText((String) ans.get("answer_text"));

        // answer_weight도 Number로 받음
        Object weightObj = ans.get("answer_weight");
        int weight = 0;
        if (weightObj instanceof Number) {
            weight = ((Number) weightObj).intValue();
        } else if (weightObj instanceof String) {
            weight = Integer.parseInt((String) weightObj);
        }
        surveyAnswer.setAnswerWeight(weight);

        return surveyAnswer;
    }

    public List<SurveyAnswer> getSurveyAnswers(Long responseId) {
        return repository.findByResponseId(responseId);
    }
}
