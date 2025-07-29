// service/SurveyResponseService.java
package com.jibangyoung.domain.mypage.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mypage.dto.RecommendRegionResultDto;
import com.jibangyoung.domain.mypage.dto.SurveyAnswerDto;
import com.jibangyoung.domain.mypage.dto.SurveyResponseGroupDto;
import com.jibangyoung.domain.mypage.dto.SurveyResponseGroupsResponse;
import com.jibangyoung.domain.mypage.entity.MyPageSurveyAnswer;
import com.jibangyoung.domain.mypage.repository.SurveyAnswerJpaRepository;
import com.jibangyoung.domain.mypage.repository.SurveyAnswerQueryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SurveyResponseService {
    private final SurveyAnswerJpaRepository surveyAnswerRepository;
    private final SurveyAnswerQueryRepository surveyAnswerQueryRepository;

    /**
     * 설문 응답 "묶음" 리스트 (Slice 페이징/캐시)
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "surveyResponseGroups", key = "#userId + '_' + #page + '_' + #size", unless = "#result == null")
    public SurveyResponseGroupsResponse getSurveyResponseGroups(Long userId, int page, int size) {
        List<SurveyResponseGroupDto> groupDtos = surveyAnswerQueryRepository.findGroupsByUserId(userId, page, size);
        long total = surveyAnswerQueryRepository.countGroupsByUserId(userId);
        return SurveyResponseGroupsResponse.builder()
                .responses(groupDtos)
                .totalCount(total)
                .build();
    }

    /**
     * 묶음별 상세 (문항 전체)
     */
    @Transactional(readOnly = true)
    public List<SurveyAnswerDto> getSurveyAnswersByResponseId(Long responseId) {
        return surveyAnswerRepository.findByResponseId(responseId).stream()
                .map(a -> SurveyAnswerDto.builder()
                        .answerId(a.getAnswerId())
                        .responseId(a.getResponseId())
                        .userId(a.getUserId())
                        .questionId(a.getQuestionId())
                        .optionCode(a.getOptionCode())
                        .answerText(a.getAnswerText())
                        .answerWeight(a.getAnswerWeight())
                        .submittedAt(a.getSubmittedAt())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 추천지역 산출 (임시: 최고점 answer, 실제 프로젝트 로직에 맞게 커스텀)
     */
    @Transactional(readOnly = true)
    public RecommendRegionResultDto recommendRegion(Long responseId) {
        List<MyPageSurveyAnswer> answers = surveyAnswerRepository.findByResponseId(responseId);
        MyPageSurveyAnswer max = answers.stream()
                .max(java.util.Comparator.comparing(a -> a.getAnswerWeight() != null ? a.getAnswerWeight() : 0))
                .orElseThrow(() -> new RuntimeException("설문 응답이 존재하지 않습니다."));
        // 실제 추천로직 적용 필요 (여기선 answerText = 지역명이라고 가정)
        return RecommendRegionResultDto.builder()
                .regionName(max.getAnswerText())
                .score(max.getAnswerWeight() != null ? max.getAnswerWeight() : 0)
                .reason("최고점 응답 기반 추천") // 실 로직 명시
                .build();
    }
}
