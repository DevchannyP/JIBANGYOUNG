package com.jibangyoung.domain.community.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import com.jibangyoung.domain.policy.entity.Region;
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

}