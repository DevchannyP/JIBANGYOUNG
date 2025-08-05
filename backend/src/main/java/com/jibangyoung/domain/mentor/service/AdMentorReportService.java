package com.jibangyoung.domain.mentor.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mentor.dto.AdMentorReportDTO;
import com.jibangyoung.domain.mentor.repository.AdMentorReportQueryRepository;
import com.jibangyoung.domain.mentor.repository.AdMentorReportRepository;
import com.jibangyoung.domain.mentor.repository.AdMentorUserRepository;
import com.jibangyoung.domain.mypage.entity.Report;
import com.jibangyoung.domain.mypage.entity.ReportTargetType;
import com.jibangyoung.domain.mypage.entity.ReviewResultCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdMentorReportService {
    private final AdMentorUserRepository mentorProfileTestRepository;   // regionId 조회용 (User)
    private final AdMentorReportRepository mentorReportRepository;      // Report 엔티티 조회/수정용
    private final AdMentorReportQueryRepository mentorReportQueryRepository; // QueryDSL 용


    // 멘토_데스보드_신고목록
    public List<AdMentorReportDTO> getReportsByMentorRegionAndType(Long mentorUserId, String type) {
        // regionIds 조회
        List<Long> regionIds = mentorProfileTestRepository.findRegionIdByUserId(mentorUserId);

        // 2자리 prefix 변환 (ex: 110000 -> "11")
        List<String> regionPrefixes = regionIds.stream()
            .map(id -> String.valueOf(id).substring(0, 2))
            .distinct()
            .collect(Collectors.toList());

        // ENUM 변환
        ReportTargetType targetType = ReportTargetType.valueOf(type);

        // QueryDSL 레포 호출
        return mentorReportQueryRepository.findReportsByMentorRegionsAndType(regionPrefixes, targetType);
    }

    // 멘토_데스보드_신고목록_처리상태(승인요청/무시/무효)
    @Transactional
    public void updateReportStatus(Long reportId, String status, Long reviewedBy) {
        Report report = mentorReportRepository.findById(reportId)
            .orElseThrow(() -> new IllegalArgumentException("해당 신고내역이 존재하지 않습니다: " + reportId));
        report.setReviewResultCode(ReviewResultCode.valueOf(status));
        report.setReviewedBy(reviewedBy);
    }

}
