package com.jibangyoung.domain.mypage.service;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.mypage.dto.SurveyHistoryDto;
import com.jibangyoung.domain.mypage.entity.SurveyHistory;
import com.jibangyoung.domain.mypage.repository.SurveyHistoryRepository;
import com.jibangyoung.global.exception.ErrorCode;
import com.jibangyoung.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyHistoryService {

    private final SurveyHistoryRepository surveyHistoryRepository;
    private final UserRepository userRepository;

    /**
     * 조회: 페이징, 정렬 옵션 적용
     * @param userId 사용자 PK
     * @param page 1-based page index
     * @param size 페이지 크기
     * @param sort recent | favorite 정렬
     */
    @Transactional(readOnly = true)
    public SurveyListResponse getMySurveyHistory(Long userId, int page, int size, String sort) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "설문 이력 사용자 없음"));

        Page<SurveyHistory> pageResult;

        if ("favorite".equalsIgnoreCase(sort)) {
            pageResult = surveyHistoryRepository.findByUserOrderByIsFavoriteDescParticipatedAtDesc(user, PageRequest.of(page - 1, size));
        } else {
            pageResult = surveyHistoryRepository.findByUserOrderByParticipatedAtDesc(user, PageRequest.of(page - 1, size));
        }

        List<SurveyHistoryDto> dtos = pageResult.stream()
            .map(SurveyHistoryDto::from)
            .collect(Collectors.toList());

        return new SurveyListResponse(dtos, pageResult.getTotalElements());
    }

    public record SurveyListResponse(List<SurveyHistoryDto> surveys, long totalCount) {}
}
