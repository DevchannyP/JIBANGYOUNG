package com.jibangyoung.domain.mypage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.mypage.entity.UserActivityEvent;

public interface UserActivityEventRepository extends JpaRepository<UserActivityEvent, Long> {
    // 필요시 커스텀 쿼리 작성
}
