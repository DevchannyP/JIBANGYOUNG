package com.jibangyoung.domain.mentor.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.auth.entity.User;

public interface AdMentorUserRepository extends JpaRepository<User, Long>{
    // 멘토 데시보드_유저 상태제어 리스트(동일 지역유저)
    // SELECT * FROM users WHERE region = ?
    List<User> findByRegion(String region);

    // 지역+멘토 등급
    // List<User> findByRegionAndRole(String region, UserRole role);
}
