package com.jibangyoung.domain.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jibangyoung.domain.auth.entity.User;

// 유저 리스트 조회
public interface AdUserRepository extends JpaRepository<User, Long> {
    
} 