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

    /** 기본 목록: 논리 삭제 제외 */
    Page<Comment> findByUserAndIsDeletedFalseOrderByCreatedAtDesc(
            User user, Pageable pageable);

    /** 관리자용: 논리 삭제 포함 */
    @Query("SELECT c FROM Comment c WHERE c.user = :user ORDER BY c.createdAt DESC")
    Page<Comment> findAllByUserIncludeDeleted(@Param("user") User user, Pageable pageable);

    /** 논리 삭제만 조회 */
    @Query("SELECT c FROM Comment c WHERE c.user = :user AND c.isDeleted = true ORDER BY c.createdAt DESC")
    Page<Comment> findDeletedByUser(@Param("user") User user, Pageable pageable);

    /** 단건 조회(논리 삭제 포함) */
    @Query("SELECT c FROM Comment c WHERE c.id = :id")
    Optional<Comment> findByIdIncludeDeleted(@Param("id") Long id);
}
