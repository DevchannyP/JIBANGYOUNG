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

    /** 논리 삭제되지 않은 댓글만(일반 사용자용) - posts 테이블과 조인하여 regionId도 함께 조회 */
    @Query(value = "SELECT c.id, c.content, c.created_at, c.is_deleted, c.parent_id, " +
            "c.target_post_id, c.target_post_title, c.updated_at, c.user_id, p.region_id " +
            "FROM comment c JOIN posts p ON c.target_post_id = p.id " +
            "WHERE c.user_id = :#{#user.id} AND c.is_deleted = false " +
            "ORDER BY c.created_at DESC", countQuery = "SELECT COUNT(c.id) FROM comment c " +
                    "JOIN posts p ON c.target_post_id = p.id " +
                    "WHERE c.user_id = :#{#user.id} AND c.is_deleted = false", nativeQuery = true)
    Page<Object[]> findByUserAndIsDeletedFalseWithRegionIdOrderByCreatedAtDesc(
            @Param("user") User user, Pageable pageable);

    @Query(value = "SELECT c.id, c.content, c.created_at, c.is_deleted, c.parent_id, " +
            "c.target_post_id, c.target_post_title, c.updated_at, c.user_id, p.region_id " +
            "FROM comment c JOIN posts p ON c.target_post_id = p.id " +
            "WHERE c.user_id = :#{#user.id} " +
            "ORDER BY c.created_at DESC", countQuery = "SELECT COUNT(c.id) FROM comment c " +
                    "JOIN posts p ON c.target_post_id = p.id " +
                    "WHERE c.user_id = :#{#user.id}", nativeQuery = true)
    Page<Object[]> findAllByUserIncludeDeletedWithRegionId(@Param("user") User user, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.user = :user AND c.isDeleted = true ORDER BY c.createdAt DESC")
    Page<Comment> findDeletedByUser(@Param("user") User user, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.id = :id")
    Optional<Comment> findByIdIncludeDeleted(@Param("id") Long id);

    Optional<Comment> findByIdAndIsDeletedFalse(Long id);

    List<Comment> findByTargetPostId(Long postId);
}