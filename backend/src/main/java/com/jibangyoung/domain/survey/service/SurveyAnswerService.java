package com.jibangyoung.domain.survey.service;

import com.jibangyoung.domain.survey.dto.AnswerJsonDto.Answer;
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
    public void saveSurveyAnswers(Long userId, Map<String, Answer> answers) {
        Long responseId = 1L; // TODO: 실제 responseId 생성 로직 적용

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
    }

    private SurveyAnswer buildSurveyAnswer(Long userId, Long responseId, String questionCode, Object value, Answer answer) {
        SurveyAnswer surveyAnswer = new SurveyAnswer();
        surveyAnswer.setUserId(userId);
        surveyAnswer.setResponseId(responseId);
        surveyAnswer.setQuestionId(questionCode);

        // optionCode, answerText, answerWeight 세팅 예시 (필요시 상세 구현)
        int optionCode = 0; // 임시 기본값
        surveyAnswer.setOptionCode(optionCode);

        if (answer.getText() instanceof String) {
            surveyAnswer.setAnswerText((String) answer.getText());
        } else {
            surveyAnswer.setAnswerText(String.valueOf(value));
        }

        int weight = 0;
        if (answer.getWeight() instanceof Number) {
            weight = ((Number) answer.getWeight()).intValue();
        } else if (answer.getWeight() instanceof String) {
            try {
                weight = Integer.parseInt((String) answer.getWeight());
            } catch (NumberFormatException e) {
                weight = 0;
            }
        }
        surveyAnswer.setAnswerWeight(weight);

        return surveyAnswer;
    }
}
