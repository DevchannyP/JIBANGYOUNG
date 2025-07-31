package com.jibangyoung.domain.mypage.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.mypage.entity.Post;

public interface MyPostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(long userId, Pageable pageable);
}
