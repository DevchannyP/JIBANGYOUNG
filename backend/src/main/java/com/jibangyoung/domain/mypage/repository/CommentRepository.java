package com.jibangyoung.domain.mypage.repository;

import java.util.List;
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

    @Query("SELECT c FROM Comment c WHERE c.user = :user ORDER BY c.createdAt DESC")
    Page<Comment> findAllByUserIncludeDeleted(@Param("user") User user, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.user = :user AND c.isDeleted = true ORDER BY c.createdAt DESC")
    Page<Comment> findDeletedByUser(@Param("user") User user, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.id = :id")
    Optional<Comment> findByIdIncludeDeleted(@Param("id") Long id);

    Optional<Comment> findByIdAndIsDeletedFalse(Long id);

    List<Comment> findByTargetPostId(Long postId);
}
