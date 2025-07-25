package com.jibangyoung.domain.mypage.service;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.mypage.dto.AlertInfoDto;
import com.jibangyoung.domain.mypage.repository.AlertRepository;
import com.jibangyoung.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

/**
 * Slice 기반 관심지역 알림 조회 서비스
 * - 서버비용 절감: Slice 페이징(다음 페이지 여부만 응답)
 * - 즉시/최신순 정렬, 확장 가능 구조
 */
@Service
@RequiredArgsConstructor
public class AlertQueryService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;

    /**
     * 로그인 사용자 기준 관심지역 알림 Slice 조회
     * @param userId 사용자 PK
     * @param page 0-base page
     * @param size page size
     */
    public Slice<AlertInfoDto> getUserAlerts(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        return alertRepository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(page, size))
            .map(AlertInfoDto::from);
    }
}
