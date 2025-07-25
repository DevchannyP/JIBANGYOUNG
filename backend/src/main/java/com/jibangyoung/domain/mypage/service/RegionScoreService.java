package com.jibangyoung.domain.mypage.service;

import com.jibangyoung.domain.mypage.dto.RegionScoreDto;
import com.jibangyoung.domain.mypage.entity.RegionScore;
import com.jibangyoung.domain.mypage.repository.RegionScoreRepository;
import com.jibangyoung.global.exception.ErrorCode;
import com.jibangyoung.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 지역별 점수/히스토리 서비스
 * - DTO Projection, @EntityGraph로 비용/로딩 최적화
 */
@Service
@RequiredArgsConstructor
public class RegionScoreService {

    private final RegionScoreRepository regionScoreRepository;

    @Transactional(readOnly = true)
    public RegionScoreDto getRegionScore(String region) {
        RegionScore entity = regionScoreRepository.findByRegion(region)
            .orElseThrow(() -> new NotFoundException(ErrorCode.INVALID_INPUT_VALUE, "해당 지역 점수를 찾을 수 없습니다."));
        return RegionScoreDto.from(entity);
    }
}
