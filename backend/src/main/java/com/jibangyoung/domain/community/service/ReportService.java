package com.jibangyoung.domain.community.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.community.dto.ReportCreateRequestDto;
import com.jibangyoung.domain.mypage.entity.Report;
import com.jibangyoung.domain.mypage.repository.ReportRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createReport(Long userId, ReportCreateRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 중복 신고 방지 (동일 사용자가 동일 대상에 대해 이미 신고한 경우)
        boolean alreadyReported = reportRepository.existsByUserIdAndTargetTypeAndTargetId(
                userId, requestDto.getTargetType(), requestDto.getTargetId());

        if (alreadyReported) {
            throw new RuntimeException("이미 신고한 대상입니다.");
        }

        // 정적 팩토리 메서드를 사용한 Report 생성
        Report report = Report.createReport(
                user,
                requestDto.getTargetType(),
                requestDto.getTargetId(),
                requestDto.getReasonCode(),
                requestDto.getReasonDetail());

        reportRepository.save(report);

        log.info("신고가 접수되었습니다. 사용자: {}, 대상: {} (ID: {}), 사유: {}",
                userId, requestDto.getTargetType(), requestDto.getTargetId(), requestDto.getReasonCode());
    }
}