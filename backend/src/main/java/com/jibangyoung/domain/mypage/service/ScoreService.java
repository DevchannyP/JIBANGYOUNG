package com.jibangyoung.domain.mypage.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mypage.dto.ActivityEventDto;
import com.jibangyoung.domain.mypage.dto.MyRegionScoreDto;
import com.jibangyoung.domain.mypage.dto.RegionScoreDto;
import com.jibangyoung.domain.mypage.dto.RegionScoreDto.ScoreHistoryItem;
import com.jibangyoung.domain.mypage.entity.UserActivityEvent;
import com.jibangyoung.domain.mypage.entity.UserRegionScore;
import com.jibangyoung.domain.mypage.repository.UserActivityEventRepository;
import com.jibangyoung.domain.mypage.repository.UserRegionScoreRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final UserActivityEventRepository activityRepo;
    private final UserRegionScoreRepository scoreRepo;

    /** 1. 단일 지역 점수 상세 조회 */
    @Transactional(readOnly = true)
    public RegionScoreDto getRegionScore(Long userId, int regionId) {
        // region/user별 누적 점수 조회
        UserRegionScore score = scoreRepo.findByUserIdAndRegionId(userId, regionId)
                .orElse(new UserRegionScore(userId, regionId, 0L, null));

        int postCount = getPostCount(userId, regionId);
        int commentCount = getCommentCount(userId, regionId);
        int mentoringCount = getMentoringCount(userId, regionId);
        int totalScore = score.getTotalScore() == null ? 0 : score.getTotalScore().intValue();
        double progress = Math.min(1.0, totalScore / 100.0);
        int daysToMentor = 7; // TODO: 실제 계산

        List<ScoreHistoryItem> history = activityRepo
                .findTop30ByUserIdAndRegionIdOrderByCreatedAtDesc(userId, regionId)
                .stream()
                .map(ev -> new ScoreHistoryItem(
                        ev.getCreatedAt() != null ? ev.getCreatedAt().toLocalDate().toString() : null,
                        ev.getScoreDelta() == null ? 0 : ev.getScoreDelta(),
                        ev.getActionType() == null ? "" : ev.getActionType()))
                .collect(Collectors.toList());

        String regionName = getRegionName(regionId);

        return new RegionScoreDto(
                regionId,
                regionName,
                postCount,
                commentCount,
                mentoringCount,
                totalScore,
                progress,
                daysToMentor,
                history);
    }

    /** 2. 지역별 TOP-N 랭킹 */
    @Transactional(readOnly = true)
    public List<RegionScoreDto> getTopRankByRegion(int regionId, int size) {
        List<UserRegionScore> rank = scoreRepo.findByRegionIdOrderByTotalScoreDesc(regionId);
        return rank.stream()
                .limit(size)
                .map(rs -> new RegionScoreDto(
                        rs.getRegionId(),
                        getRegionName(rs.getRegionId()),
                        0, 0, 0,
                        rs.getTotalScore() == null ? 0 : rs.getTotalScore().intValue(),
                        0.0, 0,
                        List.of()))
                .collect(Collectors.toList());
    }

    /** 3. 내 모든 지역별 점수 */
    @Transactional(readOnly = true)
    public List<MyRegionScoreDto> getUserRegionScores(Long userId) {
        return scoreRepo.findByUserId(userId).stream()
                .map(r -> new MyRegionScoreDto(r.getRegionId(),
                        r.getTotalScore() == null ? 0 : r.getTotalScore().intValue()))
                .collect(Collectors.toList());
    }

    /** 4. 최근 활동 이력(점수 변동) 30건 */
    @Transactional(readOnly = true)
    public List<ScoreHistoryItem> getScoreHistory(Long userId, Integer regionId) {
        return activityRepo.findTop30ByUserIdAndRegionIdOrderByCreatedAtDesc(userId, regionId)
                .stream()
                .map(ev -> new ScoreHistoryItem(
                        ev.getCreatedAt() != null ? ev.getCreatedAt().toLocalDate().toString() : null,
                        ev.getScoreDelta() == null ? 0 : ev.getScoreDelta(),
                        ev.getActionType() == null ? "" : ev.getActionType()))
                .collect(Collectors.toList());
    }

    /** 5. 활동 이벤트 기록 */
    @Transactional
    public void recordUserActivity(ActivityEventDto dto) {
        activityRepo.save(UserActivityEvent.builder()
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
                .build());
        // TODO: Redis/ZSET 반영 등 실시간 동기화 필요시 추가
    }

    // --- 내부 통계용 (더미) 메소드 ---
    private int getPostCount(Long userId, int regionId) {
        return 10;
    }

    private int getCommentCount(Long userId, int regionId) {
        return 8;
    }

    private int getMentoringCount(Long userId, int regionId) {
        return 2;
    }

    // --- regionId → regionName 예시 ---
    private String getRegionName(int regionId) {
        return switch (regionId) {
            case 30123 -> "경기";
            case 30124 -> "서울";
            case 30125 -> "강원";
            case 30126 -> "부산";
            case 30127 -> "대전";
            case 30128 -> "제주";
            default -> "기타";
        };
    }
}
