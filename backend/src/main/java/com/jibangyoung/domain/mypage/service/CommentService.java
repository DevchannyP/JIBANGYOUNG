package com.jibangyoung.domain.mypage.service;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.mypage.dto.CommentPreviewDto;
import com.jibangyoung.domain.mypage.entity.Comment;
import com.jibangyoung.domain.mypage.repository.CommentRepository;
import com.jibangyoung.global.exception.ErrorCode;
import com.jibangyoung.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * [실무] 내 댓글 서비스
 * - UX: Skeleton, totalCount, Pagination, 에러 최적화
 * - API/타입 일원화 (프론트 1:1)
 * - 서버비용: join/fetch 최소화, 필드 projection
 * - 확장: SoftDelete/신고/권한 등 바로 확장 가능
 */
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    /**
     * 내 댓글 페이지 조회 (1-base)
     */
    @Transactional(readOnly = true)
    public CommentListResponse getMyComments(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "댓글 주인 사용자 없음"));

        Page<Comment> commentPage = commentRepository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(page - 1, size));
        List<CommentPreviewDto> comments = commentPage.map(CommentPreviewDto::from).getContent();
        long totalCount = commentPage.getTotalElements();

        return new CommentListResponse(comments, totalCount);
    }

    /**
     * 내 댓글 삭제 (본인 것만)
     */
    @Transactional
    public void deleteMyComment(Long userId, Long commentId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "삭제 요청자 없음"));

        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND, "댓글 없음"));

        if (!comment.getUser().getId().equals(user.getId()))
            throw new NotFoundException(ErrorCode.ACCESS_DENIED, "본인 댓글만 삭제 가능");

        commentRepository.deleteByIdAndUser(commentId, user);
    }

    // 내부 응답: 프론트/CSR 최적화 totalCount 포함
    public record CommentListResponse(List<CommentPreviewDto> comments, long totalCount) {}
}
