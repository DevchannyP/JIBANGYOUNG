package com.jibangyoung.domain.community.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jibangyoung.domain.community.entity.Posts;


public interface PostRepository extends JpaRepository<Posts, Long> {

    // 최근 after 동안 생성된 게시글 중 좋아요 Top10 조회
    List<Posts> findTop10ByCreatedAtAfterOrderByLikesDesc(LocalDateTime after);

    // 전체 게시판에서 인기순 (추천 10개) 이상 글 목록
    @Query("SELECT p FROM Posts p WHERE p.likes >= 10 ORDER BY p.id DESC")
    Page<Posts> findPopularPosts(Pageable pageable);

    // 최근 regionCode 게시판
    @Query("SELECT p FROM Posts p WHERE p.regionId = :regionCode ORDER BY p.createdAt DESC")
    Page<Posts> findByRegionPrefix(@Param("regionCode") String regionCode, Pageable pageable);

    // 최근 regionCode 인기글 (추천 10개 이상) 글 목록
    @Query("SELECT p FROM Posts p WHERE p.regionId = :regionCode AND p.likes >= 10 ORDER BY p.createdAt DESC")
    Page<Posts> findByRegionPopular(@Param("regionCode") String regionCode, Pageable pageable);

}