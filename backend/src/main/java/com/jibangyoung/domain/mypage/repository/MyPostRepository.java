package com.jibangyoung.domain.mypage.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

// 변경: Posts로 import
import com.jibangyoung.domain.community.entity.Posts;

public interface MyPostRepository extends JpaRepository<Posts, Long> {
    Page<Posts> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(long userId, Pageable pageable);
}
