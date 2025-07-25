package com.jibangyoung.domain.mypage.service;

import com.jibangyoung.domain.mypage.dto.SurveyFavoriteDto;
import com.jibangyoung.domain.mypage.entity.SurveyFavorite;
import com.jibangyoung.domain.mypage.repository.SurveyFavoriteRepository;
import com.jibangyoung.global.exception.ErrorCode;
import com.jibangyoung.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SurveyFavoriteService {

    private final SurveyFavoriteRepository surveyFavoriteRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getFavorites(Long userId, int page, int size, String sort) {
        Pageable pageable = switch (sort) {
            case "title" -> PageRequest.of(page - 1, size, Sort.by("title").ascending());
            default      -> PageRequest.of(page - 1, size, Sort.by("id").descending());
        };
        Page<SurveyFavorite> result = surveyFavoriteRepository.findByUserIdAndIsFavoriteTrue(userId, pageable);

        return Map.of(
            "favorites", result.getContent().stream().map(SurveyFavoriteDto::from).toList(),
            "totalCount", result.getTotalElements()
        );
    }

    @Transactional
    public void toggleFavorite(Long favoriteId, Long userId) {
        SurveyFavorite fav = surveyFavoriteRepository.findById(favoriteId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND, "해당 즐겨찾기를 찾을 수 없습니다."));
        if (!fav.getUser().getId().equals(userId))
            throw new NotFoundException(ErrorCode.ACCESS_DENIED, "내 즐겨찾기만 변경 가능합니다.");
        fav.toggleFavorite();
        surveyFavoriteRepository.save(fav);
    }
}
