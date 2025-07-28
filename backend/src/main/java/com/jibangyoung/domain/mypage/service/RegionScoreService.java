package com.jibangyoung.domain.mypage.service;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mypage.dto.RegionScoreDto;
import com.jibangyoung.domain.mypage.repository.UserActivityEventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegionScoreService {

    private final UserActivityEventRepository repository;

    @Transactional(readOnly = true)
    public RegionScoreDto getRegionScore(Long userId, Long regionId) {
        var stat = repository.findRegionScoreStat(userId, regionId);
        var historyList = repository.findScoreHistory(userId, regionId);
        String regionName = repository.findRegionName(regionId);

        return RegionScoreDto.builder()
                .regionId(regionId)
                .regionName(regionName)
                .postCount(stat != null ? stat.getPostCount() : 0)
                .commentCount(stat != null ? stat.getCommentCount() : 0)
                .mentoringCount(stat != null ? stat.getMentoringCount() : 0)
                .score(stat != null ? stat.getScore() : 0)
                .promotionProgress(calcPromotionProgress(stat))
                .daysToMentor(calcDaysToMentor(stat))
                .scoreHistory(
                        historyList.stream().limit(10)
                                .map(h -> RegionScoreDto.ScoreHistoryDto.builder()
                                        .date(h.getDate() != null ? h.getDate().format(DateTimeFormatter.ISO_DATE)
                                                : "-")
                                        .delta(h.getDelta())
                                        .reason(h.getReason())
                                        .build())
                                .toList())
                .build();
    }

    private float calcPromotionProgress(UserActivityEventRepository.RegionScoreStat stat) {
        int score = stat == null ? 0 : stat.getScore();
        int maxScore = 1000;
        return Math.min(1.0f, score / (float) maxScore);
    }

    private int calcDaysToMentor(UserActivityEventRepository.RegionScoreStat stat) {
        return 7; // TODO: 실제 로직 구현 예정
    }
}
