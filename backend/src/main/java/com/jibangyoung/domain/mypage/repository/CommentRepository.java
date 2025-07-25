package com.jibangyoung.domain.mypage.repository;

import com.jibangyoung.domain.mypage.entity.Comment;
import com.jibangyoung.domain.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * [실무] 댓글 레포지토리
 * - Page 기반, 인덱스 최적화, totalCount 지원
 * - API/타입 구조 일원화
 */
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    void deleteByIdAndUser(Long id, User user);
}
