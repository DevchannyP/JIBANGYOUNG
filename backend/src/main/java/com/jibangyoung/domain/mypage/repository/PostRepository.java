package com.jibangyoung.domain.mypage.repository;

import com.jibangyoung.domain.mypage.entity.Post;
import com.jibangyoung.domain.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * [실무] 내 게시글 레포지토리
 * - Page, 최신순, totalCount 지원
 * - 확장: QueryDSL/조건검색, Slice 등 적용 용이
 */
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}
