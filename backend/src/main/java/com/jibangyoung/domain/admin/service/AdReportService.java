package com.jibangyoung.domain.admin.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.admin.dto.AdReportDto;
import com.jibangyoung.domain.admin.repository.AdReportQueryRepository;
import com.jibangyoung.domain.admin.repository.AdReportRepository;
import com.jibangyoung.domain.mypage.entity.Report;
import com.jibangyoung.domain.mypage.entity.ReportTargetType;
import com.jibangyoung.domain.mypage.entity.ReviewResultCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdReportService {
    private final AdReportQueryRepository AdReportQueryRepository;
    private final AdReportRepository aReportRepository;

    // 1. REQUESTED 상태인 신고만 DTO로 반환 (JPQL)
    public List<AdReportDto> getRequestedReports(Long adminUserId, String type) {
        if (type == null || type.isBlank()) {
            return AdReportQueryRepository.findRequestedReports(null);
        } else {
            return AdReportQueryRepository.findRequestedReports(ReportTargetType.valueOf(type));
        }
    }

    // 2. 상태 변경 (승인/반려)
    @Transactional
    public void updateReportStatus(Long reportId, String status, Long reviewedBy) {
        Report report = aReportRepository.findById(reportId)
            .orElseThrow(() -> new IllegalArgumentException("해당 신고내역이 존재하지 않습니다: " + reportId));
        report.setReviewResultCode(ReviewResultCode.valueOf(status)); // "APPROVED", "REJECTED" 등
        report.setReviewedBy(reviewedBy);
        report.setReviewedAt(LocalDateTime.now());
    }
}
