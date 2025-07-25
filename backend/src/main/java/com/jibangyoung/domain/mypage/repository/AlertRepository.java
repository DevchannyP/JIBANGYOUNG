package com.jibangyoung.domain.mypage.repository;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.mypage.entity.Alert;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 관심지역 알림 JPA + Slice 최적화
 * - user+createdAt 인덱스 기반 쿼리
 */
public interface AlertRepository extends JpaRepository<Alert, Long> {
    Slice<Alert> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}
