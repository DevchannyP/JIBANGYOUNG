package com.jibangyoung.domain.mypage.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.mypage.dto.CommentPreviewDto;
import com.jibangyoung.domain.mypage.entity.Comment;
import com.jibangyoung.domain.mypage.repository.CommentRepository;
import com.jibangyoung.global.exception.ErrorCode;
import com.jibangyoung.global.exception.NotFoundException;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    /**
     * 내 댓글 논리 삭제 (soft delete)
     */
    @Transactional
    public void deleteMyComment(Long userId, Long commentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "삭제 요청자 없음"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND, "댓글 없음"));

        if (!comment.getUser().getId().equals(user.getId()))
            throw new NotFoundException(ErrorCode.ACCESS_DENIED, "본인 댓글만 삭제 가능");

        // 소프트 삭제만 허용
        comment.softDelete();
    }

    /**
     * 내 댓글 목록 조회 (논리삭제 제외) - regionId 포함
     */
    @Transactional(readOnly = true)
    public Page<CommentPreviewDto> getMyComments(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "유저 없음"));

        // Native Query 결과를 CommentPreviewDto로 변환
        return commentRepository.findByUserAndIsDeletedFalseWithRegionIdOrderByCreatedAtDesc(user, pageable)
                .map(objects -> {
                    // Native Query 결과: [id, content, created_at, is_deleted, parent_id,
                    // target_post_id, target_post_title, updated_at, user_id, region_id]
                    Long id = ((Number) objects[0]).longValue();
                    String content = (String) objects[1];
                    java.sql.Timestamp createdAt = (java.sql.Timestamp) objects[2];
                    Long targetPostId = ((Number) objects[5]).longValue();
                    String targetPostTitle = (String) objects[6];
                    Long regionId = ((Number) objects[9]).longValue();

                    return new CommentPreviewDto(
                            id,
                            content,
                            targetPostId,
                            targetPostTitle,
                            createdAt.toLocalDateTime(),
                            regionId);
                });
    }

    /**
     * [관리자] 논리삭제 포함 전체 조회 - regionId 포함
     */
    @Transactional(readOnly = true)
    public Page<CommentPreviewDto> getAllMyCommentsIncludeDeleted(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "유저 없음"));

        return commentRepository.findAllByUserIncludeDeletedWithRegionId(user, pageable)
                .map(objects -> {
                    // Native Query 결과 파싱 동일
                    Long id = ((Number) objects[0]).longValue();
                    String content = (String) objects[1];
                    java.sql.Timestamp createdAt = (java.sql.Timestamp) objects[2];
                    Long targetPostId = ((Number) objects[5]).longValue();
                    String targetPostTitle = (String) objects[6];
                    Long regionId = ((Number) objects[9]).longValue();

                    return new CommentPreviewDto(
                            id,
                            content,
                            targetPostId,
                            targetPostTitle,
                            createdAt.toLocalDateTime(),
                            regionId);
                });
    }
}
