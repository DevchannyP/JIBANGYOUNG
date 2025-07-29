package com.jibangyoung.domain.mypage.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.mypage.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    /** 논리 삭제되지 않은 댓글만(일반 사용자용) */
    Page<Comment> findByUserAndIsDeletedFalseOrderByCreatedAtDesc(
            User user, Pageable pageable);

    /** 관리자: 삭제 포함 전체 조회 */
    @Query("SELECT c FROM Comment c WHERE c.user = :user ORDER BY c.createdAt DESC")
    Page<Comment> findAllByUserIncludeDeleted(@Param("user") User user, Pageable pageable);

    /** 논리 삭제된 댓글만 */
    @Query("SELECT c FROM Comment c WHERE c.user = :user AND c.isDeleted = true ORDER BY c.createdAt DESC")
    Page<Comment> findDeletedByUser(@Param("user") User user, Pageable pageable);

    /** 단건 조회(삭제 포함, 삭제 제외는 isDeletedFalse 조건 추가) */
    @Query("SELECT c FROM Comment c WHERE c.id = :id")
    Optional<Comment> findByIdIncludeDeleted(@Param("id") Long id);

    /** 단건 조회(삭제 제외, 일반적으로 많이 사용) */
    Optional<Comment> findByIdAndIsDeletedFalse(Long id);
}
