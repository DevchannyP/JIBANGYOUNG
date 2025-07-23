package com.jibangyoung.domain.mypage.repository;

import com.jibangyoung.domain.mypage.entity.UserPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserPostRepository extends JpaRepository<UserPost, Long> {
    List<UserPost> findByUserId(Long userId);
}
