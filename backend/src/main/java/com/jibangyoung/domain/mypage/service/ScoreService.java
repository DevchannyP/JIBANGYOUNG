package com.jibangyoung.domain.mypage.service;

import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.jibangyoung.domain.mypage.dto.ActivityEventDto;
import com.jibangyoung.domain.mypage.dto.MyRegionScoreDto;
import com.jibangyoung.domain.mypage.dto.RegionScoreDto;
import com.jibangyoung.domain.mypage.entity.UserActivityEvent;
import com.jibangyoung.domain.mypage.repository.UserActivityEventRepository;
import com.jibangyoung.domain.mypage.repository.UserRegionScoreRepository;
import com.jibangyoung.domain.mypage.support.ActivityLogger;
import com.jibangyoung.domain.mypage.support.RedisScoreHelper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final RedisScoreHelper redisScoreHelper;
    private final UserRegionScoreRepository regionScoreRepo;
    private final UserActivityEventRepository activityEventRepo;
    private final ActivityLogger activityLogger;

    @Async
    public void recordUserActivity(ActivityEventDto event) {
        redisScoreHelper.incrementScore(event.userId(), event.regionId(), event.scoreDelta());
        activityEventRepo.save(toEntity(event));
        activityLogger.logActivity(event);
    }

    public List<RegionScoreDto> getTopRankByRegion(int regionId, int size) {
        return redisScoreHelper.getTopRank(regionId, size);
    }

    public List<MyRegionScoreDto> getUserRegionScores(Long userId) {
        return redisScoreHelper.getUserRegionScores(userId);
    }

    private static UserActivityEvent toEntity(ActivityEventDto dto) {
        return UserActivityEvent.builder()
                .userId(dto.userId())
                .regionId(dto.regionId())
                .actionType(dto.actionType())
                .refId(dto.refId())
                .parentRefId(dto.parentRefId())
                .actionValue(dto.actionValue())
                .scoreDelta(dto.scoreDelta())
                .meta(dto.meta())
                .ipAddr(dto.ipAddr())
                .userAgent(dto.userAgent())
                .platform(dto.platform())
                .lang(dto.lang())
                .status(dto.status())
                .memo(dto.memo())
                .createdAt(dto.createdAt())
                .updatedAt(dto.updatedAt())
                .build();
    }
}
