package com.jibangyoung.domain.community.repository;

import java.time.LocalDateTime;
import java.util.Collection;
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

    // 전체 게시판에서 추천수 이상 글 목록
    Page<Posts> findByLikesGreaterThanEqualOrderByIdDesc(int i, Pageable pageable);

    // 최근 regionCode 게시판
    Page<Posts> findByRegionIdOrderByCreatedAtDesc(long regionId, Pageable pageable);

    // 최근 regionCode 추천 수 이상 글 목록
    Page<Posts> findByRegionIdAndLikesGreaterThanEqualOrderByCreatedAtDesc(Long regionId, int likes, Pageable pageable);

    // Category 추천수 이상 글 목록
    List<Posts> findTop10ByCategoryOrderByLikesDesc(Posts.PostCategory postCategory);

    // 지역 및 카테고리별 게시글 조회
    Page<Posts> findByRegionIdAndCategoryOrderByCreatedAtDesc(Long regionId, Posts.PostCategory category, Pageable pageable);

    // 지역 및 제목으로 게시글 검색
    Page<Posts> findByRegionIdAndTitleContainingOrderByCreatedAtDesc(Long regionId, String title, Pageable pageable);

    // 지역 및 내용으로 게시글 검색
    Page<Posts> findByRegionIdAndContentContainingOrderByCreatedAtDesc(Long regionId, String content, Pageable pageable);

    // 공지사항 (isNotice = true) 중 최신 2개 조회
    List<Posts> findTop2ByIsNoticeTrueOrderByCreatedAtDesc();

    // 지역별 공지사항 조회 (갯수 제한 없음)
    List<Posts> findByRegionIdAndIsNoticeTrueOrderByCreatedAtDesc(Long regionId);

    // 지역별 인기글 조회 (좋아요 순)
    List<Posts> findTop10ByRegionIdOrderByLikesDesc(Long regionId);

}