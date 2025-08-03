package com.jibangyoung.domain.dashboard.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PolicyHotRankCacheScheduler {

    private final PolicyHotRankService service;

    // 5분마다 DB→Redis 갱신
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void refreshPolicyHotTop10Cache() {
        service.cachePolicyHotTop10();
    }
}
