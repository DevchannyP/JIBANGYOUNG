package com.jibangyoung.domain.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jibangyoung.domain.community.entity.Post;

public interface AdPostRepository extends JpaRepository<Post, Long>{
    // 게시글관리(최신순 정렬)
    List<Post> findAllByOrderByCreatedAtDesc();
} 