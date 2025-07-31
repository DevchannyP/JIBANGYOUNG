package com.jibangyoung.domain.mypage.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.mypage.entity.Comment;
import com.jibangyoung.domain.mypage.repository.CommentRepository;
import com.jibangyoung.global.exception.ErrorCode;
import com.jibangyoung.global.exception.NotFoundException; // ← 직접 만든 커스텀 예외 import 필요!

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
     * 내 댓글 목록 조회 (논리삭제 제외)
     */
    @Transactional(readOnly = true)
    public Page<Comment> getMyComments(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "유저 없음"));
        // ✅ 논리 삭제 필터가 적용된 메서드 호출
        return commentRepository.findByUserAndIsDeletedFalseOrderByCreatedAtDesc(user, pageable);
    }

    /**
     * [관리자] 논리삭제 포함 전체 조회
     */
    @Transactional(readOnly = true)
    public Page<Comment> getAllMyCommentsIncludeDeleted(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "유저 없음"));
        return commentRepository.findAllByUserIncludeDeleted(user, pageable);
    }
}
