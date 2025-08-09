package com.jibangyoung.domain.admin.support;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.jibangyoung.domain.admin.service.AdMentorPromotionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdMentorPromotionScheduler {
    private final AdMentorPromotionService promotionService;

    // 매 1시간(정각) 마다
    @Scheduled(cron = "0 0 * * * *")
    public void promote() {
        var r = promotionService.runPromotion();
        log.info("[MentorPromotion] promotedToB={}, promotedToA={}",
                r.getPromotedToB(), r.getPromotedToA());
    }  
}
