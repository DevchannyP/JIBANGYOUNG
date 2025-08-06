package com.jibangyoung.domain.dashboard.service;

import java.util.List;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.dashboard.dto.ReviewPostDto;
import com.jibangyoung.domain.dashboard.repository.ReviewDashboardRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewDashboardService {

    private final ReviewDashboardRepository reviewDashboardRepository;

    /**
     * 인기 정착 후기 Top3 조회 (지역 조인 없이)
     */
    public List<ReviewPostDto> getReviewTop3() {
        try {
            List<Object[]> results = reviewDashboardRepository.findTop3ReviewPosts();

            return IntStream.range(0, results.size())
                    .mapToObj(i -> {
                        Object[] row = results.get(i);
                        Long regionId = row[5] != null ? ((Number) row[5]).longValue() : null;

                        return ReviewPostDto.builder()
                                .id(((Number) row[1]).longValue())
                                .no(String.format("%02d", i + 1)) // 01, 02, 03 형태로 순번 생성
                                .title((String) row[2])
                                .author((String) row[3])
                                .content((String) row[4])
                                .regionId(regionId)
                                .regionName(getRegionNameById(regionId)) // regionId로 지역명 생성
                                .thumbnailUrl((String) row[6])
                                .likes(row[7] != null ? ((Number) row[7]).intValue() : 0)
                                .views(row[8] != null ? ((Number) row[8]).intValue() : 0)
                                .createdAt((String) row[9])
                                .summary((String) row[10])
                                .build();
                    })
                    .toList();

        } catch (Exception e) {
            log.error("인기 정착 후기 Top3 조회 중 오류 발생", e);
            return List.of(); // 빈 리스트 반환
        }
    }

    /**
     * regionId로 지역명 생성 (간단한 매핑 로직)
     * 실제 환경에서는 별도 서비스나 캐시를 사용할 수 있음
     */
    private String getRegionNameById(Long regionId) {
        if (regionId == null) {
            return "전국";
        }

        // 간단한 지역 매핑 (실제로는 enum이나 별도 매핑 테이블 사용)
        return switch (regionId.intValue()) {
            case 1 -> "서울특별시";
            case 2 -> "부산광역시";
            case 3 -> "대구광역시";
            case 4 -> "인천광역시";
            case 5 -> "광주광역시";
            case 6 -> "대전광역시";
            case 7 -> "울산광역시";
            case 8 -> "세종특별자치시";
            case 9 -> "경기도";
            case 10 -> "강원도";
            case 11 -> "충청북도";
            case 12 -> "충청남도";
            case 13 -> "전라북도";
            case 14 -> "전라남도";
            case 15 -> "경상북도";
            case 16 -> "경상남도";
            case 17 -> "제주특별자치도";
            default -> "기타지역";
        };
    }
}