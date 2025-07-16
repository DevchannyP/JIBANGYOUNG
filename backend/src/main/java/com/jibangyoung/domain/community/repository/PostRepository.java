package com.jibangyoung.domain.community.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.community.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    // List<Post> findTop10ByCreatedAtAfterOrderByLikeDesc(LocalDateTime after);
}