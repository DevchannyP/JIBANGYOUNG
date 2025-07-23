package com.jibangyoung.domain.mypage.repository;

import com.jibangyoung.domain.mypage.entity.UserAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAlertRepository extends JpaRepository<UserAlert, Long> {
    List<UserAlert> findByUserId(Long userId);
}
