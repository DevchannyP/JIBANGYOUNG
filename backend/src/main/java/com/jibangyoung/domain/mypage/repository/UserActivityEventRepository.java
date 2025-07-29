package com.jibangyoung.domain.mypage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.mypage.entity.UserActivityEvent;

public interface UserActivityEventRepository extends JpaRepository<UserActivityEvent, Long> {
    // 지역/유저별 최근 활동이력 최대 30건
    List<UserActivityEvent> findTop30ByUserIdAndRegionIdOrderByCreatedAtDesc(Long userId, Integer regionId);

    // 지역/유저별 전체 활동이력(선택)
    List<UserActivityEvent> findByUserIdAndRegionIdOrderByCreatedAtDesc(Long userId, Integer regionId);
}
