package com.jibangyoung.domain.survey.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.survey.dto.AnswerJsonDto.Answer;
import com.jibangyoung.domain.survey.entity.SurveyAnswer;
import com.jibangyoung.domain.survey.repository.SurveyAnswerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SurveyAnswerService {

    private final SurveyAnswerRepository repository;

    @Transactional
    public Long saveSurveyAnswers(Long userId, Map<String, Answer> answers) {
        Long lastResponseId = repository.findMaxResponseIdByUserId(userId).orElse(0L);
        Long responseId = lastResponseId + 1;

        List<SurveyAnswer> saveList = new ArrayList<>();

        for (Map.Entry<String, Answer> entry : answers.entrySet()) {
            String questionCode = entry.getKey();
            Answer answer = entry.getValue();

            if (answer.getValue() instanceof List) {
                List<?> valueList = (List<?>) answer.getValue();
                for (Object singleValue : valueList) {
                    SurveyAnswer sa = buildSurveyAnswer(userId, responseId, questionCode, singleValue, answer);
                    saveList.add(sa);
                }
            } else {
                SurveyAnswer sa = buildSurveyAnswer(userId, responseId, questionCode, answer.getValue(), answer);
                saveList.add(sa);
            }
        }

        repository.saveAll(saveList);
        return Long.valueOf(responseId);
    }

    private SurveyAnswer buildSurveyAnswer(Long userId, Long responseId, String questionCode, Object value,
            Answer answer) {
        SurveyAnswer surveyAnswer = new SurveyAnswer();
        surveyAnswer.setUserId(userId);
        surveyAnswer.setResponseId(responseId);
        surveyAnswer.setQuestionId(questionCode);

        // optionCode를 String으로 저장
        surveyAnswer.setOptionCode(String.valueOf(value));

        // answerText 세팅
        if (answer.getText() instanceof String) {
            surveyAnswer.setAnswerText((String) answer.getText());
        } else if (answer.getText() instanceof List) {
            List<?> texts = (List<?>) answer.getText();
            int index = 0;
            if (answer.getValue() instanceof List) {
                index = ((List<?>) answer.getValue()).indexOf(value);
            }
            String selectedText = (index >= 0 && index < texts.size()) ? String.valueOf(texts.get(index))
                    : String.valueOf(value);
            surveyAnswer.setAnswerText(selectedText);
        } else {
            surveyAnswer.setAnswerText(String.valueOf(value));
        }

        // answerWeight 세팅 (float)
        float weight = 0f;
        if (answer.getWeight() instanceof List) {
            List<?> weights = (List<?>) answer.getWeight();
            int index = 0;
            if (answer.getValue() instanceof List) {
                index = ((List<?>) answer.getValue()).indexOf(value);
            }
            if (index >= 0 && index < weights.size()) {
                weight = parseToFloat(weights.get(index));
            }
        } else {
            weight = parseToFloat(answer.getWeight());
        }
        surveyAnswer.setAnswerWeight(weight);

        return surveyAnswer;
    }

    private float parseToFloat(Object obj) {
        if (obj instanceof Number) {
            return ((Number) obj).floatValue();
        }
        try {
            return Float.parseFloat(String.valueOf(obj));
        } catch (Exception e) {
            return 0f;
        }
    }
}