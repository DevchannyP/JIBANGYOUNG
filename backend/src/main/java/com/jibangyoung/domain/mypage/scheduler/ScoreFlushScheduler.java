package com.jibangyoung.domain.mypage.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.jibangyoung.domain.mypage.service.FlushScoreService;

import lombok.RequiredArgsConstructor;

/**
 * Redis→MariaDB 점수 플러시 스케줄러
 * - 동시성/배치 안전, 실패시 재시도/락 처리 필요
 */
@Component
@RequiredArgsConstructor
public class ScoreFlushScheduler {

    private final FlushScoreService flushScoreService;

    // 10분마다 Redis→DB 점수 동기화
    @Scheduled(cron = "0 */10 * * * *")
    public void flushScoreJob() {
        flushScoreService.flushAllScoresToDB();
    }
}
