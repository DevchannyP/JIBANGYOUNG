package com.jibangyoung.domain.community.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.community.entity.Post;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.config.annotation.web.PortMapperDsl;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 최근 {after} 동안 생성된 게시글 중 좋아요 Top10 조회
    List<Post> findTop10ByCreatedAtAfterOrderByLikesDesc(LocalDateTime after);

    @Query("SELECT p FROM Post p WHERE p.likes >= 10 ORDER BY p.id DESC")
    Page<Post> findPopularPosts(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE substring(cast(p.regionId as string), 1, 2) = :regionPrefix")
    Page<Post> findByRegionPrefix(@Param("regionPrefix") String regionPrefix, Pageable pageable);
}