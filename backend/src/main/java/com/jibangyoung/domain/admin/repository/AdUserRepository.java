package com.jibangyoung.domain.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jibangyoung.domain.auth.entity.User;

// 사용자관리_리스트조회
public interface AdUserRepository extends JpaRepository<User, Long> {
    
} 