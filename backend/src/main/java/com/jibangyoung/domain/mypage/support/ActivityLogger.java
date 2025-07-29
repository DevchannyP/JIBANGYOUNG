package com.jibangyoung.domain.mypage.support;

import org.springframework.stereotype.Component;

import com.jibangyoung.domain.mypage.dto.ActivityEventDto;

import lombok.extern.slf4j.Slf4j;

/**
 * 사용자 활동 이벤트 구조화 로그
 * - 성능 영향 최소, Kibana/ELK 연동시 JSON 출력 추천
 */
@Component
@Slf4j
public class ActivityLogger {
    public void logActivity(ActivityEventDto event) {
        log.info("[USER_ACTIVITY_EVENT] - {}", event); // 운영시 JSON 포맷팅 권장
    }
}
