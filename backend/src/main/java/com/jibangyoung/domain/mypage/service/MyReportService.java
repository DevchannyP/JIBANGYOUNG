// com.jibangyoung.domain.mypage.service.MyReportService.java
package com.jibangyoung.domain.mypage.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.mypage.dto.MyReportDto;
import com.jibangyoung.domain.mypage.repository.ReportRepository; // import 경로 확인!

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyReportService {
    private final ReportRepository reportRepository;

    public List<MyReportDto> getMyReports(Long userId) {
        return reportRepository.findByUser_IdOrderByCreatedAtDesc(userId).stream()
                .map(report -> new MyReportDto(
                        report.getId(),
                        report.getUser().getId(),
                        report.getTargetType(),
                        report.getTargetId(),
                        report.getReasonCode(),
                        report.getReasonDetail(),
                        report.getCreatedAt(),
                        report.getReviewResultCode()))
                .toList();
    }
}
