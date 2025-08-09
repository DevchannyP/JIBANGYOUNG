package com.jibangyoung.domain.admin.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.admin.dto.AdReportDto;
import com.jibangyoung.domain.admin.entity.AdminPosts;
import com.jibangyoung.domain.admin.repository.AdPostRepository;
import com.jibangyoung.domain.admin.repository.AdReportQueryRepository;
import com.jibangyoung.domain.admin.repository.AdReportRepository;
import com.jibangyoung.domain.mypage.entity.Comment;
import com.jibangyoung.domain.mypage.entity.Report;
import com.jibangyoung.domain.mypage.entity.ReportTargetType;
import com.jibangyoung.domain.mypage.entity.ReviewResultCode;
import com.jibangyoung.domain.mypage.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdReportService {
    private final AdReportQueryRepository adReportQueryRepository;
    private final AdReportRepository adReportRepository;
    private final AdPostRepository adPostRepository;
    private final CommentRepository commentRepository;

    // 1. REQUESTED 상태인 신고만 DTO로 반환 (JPQL)
    public List<AdReportDto> getRequestedReports(Long adminUserId, String type) {
        if (type == null || type.isBlank()) {
            return adReportQueryRepository.findRequestedReports(null, false);
        } else {
            return adReportQueryRepository.findRequestedReports(ReportTargetType.valueOf(type), false);
        }
    }

    // 멘토_데시보드_상태 변경 (승인/반려/승인취소)
    @Transactional
    public void updateReportStatus(Long reportId, String status, Long reviewedBy) {
        Report report = adReportRepository.findById(reportId)
            .orElseThrow(() -> new IllegalArgumentException("해당 신고내역이 존재하지 않습니다: " + reportId));
        report.setReviewResultCode(ReviewResultCode.valueOf(status));
        report.setReviewedAt(LocalDateTime.now());

        // 승인 처리(논리적 삭제)
        if ("APPROVED".equals(status)) {
            if (report.getTargetType() == ReportTargetType.POST) {
                AdminPosts post = adPostRepository.findById(report.getTargetId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다: " + report.getTargetId()));
                adPostRepository.delete(post); // soft delete (@SQLDelete)
            }
            if (report.getTargetType() == ReportTargetType.COMMENT) {
                Comment comment = commentRepository.findById(report.getTargetId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다: " + report.getTargetId()));
                commentRepository.delete(comment); // soft delete (@SQLDelete)
            }
        }

        // 승인취소 처리(복구)
        if ("REQUESTED".equals(status)) { // 승인취소 상태가 REQUESTED라고 가정
            if (report.getTargetType() == ReportTargetType.POST) {
                AdminPosts post = adPostRepository.findById(report.getTargetId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다: " + report.getTargetId()));
                post.setIsDeleted(false);
                adPostRepository.save(post);
            }
            if (report.getTargetType() == ReportTargetType.COMMENT) {
                Comment comment = commentRepository.findById(report.getTargetId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다: " + report.getTargetId()));
                comment.setIsDeleted(false);
                commentRepository.save(comment);
            }
        }
    }
}
