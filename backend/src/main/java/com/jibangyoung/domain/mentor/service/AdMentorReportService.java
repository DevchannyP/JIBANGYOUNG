package com.jibangyoung.domain.mentor.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.mentor.dto.AdMentorReportDTO;
import com.jibangyoung.domain.mentor.repository.AdMentorReportRepository;
import com.jibangyoung.domain.mentor.repository.AdMentorUserRepository;
import com.jibangyoung.domain.mypage.entity.ReportTargetType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdMentorReportService {
    private final AdMentorUserRepository mentorProfileTestRepository; // 멘토 regionId 얻기용
    private final AdMentorReportRepository mentorReportRepository;

    // 멘토 유저 id로 모든 지역코드(regionIds) 얻고, 그 지역 신고내역 리스트 통합 조회
    public List<AdMentorReportDTO> getReportsByMentorRegionAndType(Long mentorUserId, String type) {
        System.out.println("[서비스] mentorUserId: " + mentorUserId);
        System.out.println("[서비스] type 파라미터: " + type);

        List<Long> regionIds = mentorProfileTestRepository.findRegionIdByUserId(mentorUserId);
        System.out.println("[서비스] regionIds: " + regionIds);

        if (regionIds == null || regionIds.isEmpty()) {
            throw new IllegalArgumentException("멘토의 지역정보(regionId)가 존재하지 않습니다.");
        }
        // 2자리로 변환
        List<String> regionIds2Digit = regionIds.stream()
            .map(id -> String.valueOf(id).substring(0, 2))
            .distinct()
            .collect(Collectors.toList());
        System.out.println("[서비스] regionIds(2자리): " + regionIds2Digit);

        // ENUM 변환
        ReportTargetType targetType = ReportTargetType.valueOf(type);
        System.out.println("[서비스] targetType ENUM: " + targetType);

        List<AdMentorReportDTO> result = mentorReportRepository.findReportsByMentorRegionsAndType(regionIds2Digit, targetType);
        System.out.println("[서비스] 최종 결과 리스트 크기: " + result.size());

        return result;
    }
}
