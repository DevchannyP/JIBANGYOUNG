package com.jibangyoung.domain.mentor.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mentor.dto.AdMentorRequestDTO;
import com.jibangyoung.domain.mentor.entity.MentorCertificationRequests;
import com.jibangyoung.domain.mentor.repository.AdMentorUserRepository;
import com.jibangyoung.domain.mentor.repository.MentorCertificationRequestsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdMentorRequestService {

    private final MentorCertificationRequestsRepository mentorRequestRepository;
    private final AdMentorUserRepository adMentorUserRepository;


    // 멘토 신청 리스트 (로그인 유저 지역 기준)
    @Transactional(readOnly = true)
    public List<AdMentorRequestDTO> getMentorRequestsByUserRegion(Long userId) {
        List<Long> regionIds = adMentorUserRepository.findRegionIdByUserId(userId);
        if (regionIds == null || regionIds.isEmpty()) {
            return Collections.emptyList();
        }

        return mentorRequestRepository.findByRegionIdsWithReviewerNickname(regionIds);
    }


    // 1차 승인
    @Transactional
    public void approveFirst(Long requestId, Long reviewerId) {
        MentorCertificationRequests request = mentorRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("신청 내역 없음"));
        request.setStatus(MentorCertificationRequests.Status.FIRST_APPROVED);
        request.setReviewedBy(reviewerId);
        request.setReviewedAt(LocalDateTime.now());
        mentorRequestRepository.save(request);
    }

    // 2차 승인
    @Transactional
    public void approveSecond(Long requestId, Long reviewerId) {
        MentorCertificationRequests request = mentorRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("신청 내역 없음"));
        request.setStatus(MentorCertificationRequests.Status.SECOND_APPROVED);
        request.setReviewedBy(reviewerId);
        request.setReviewedAt(LocalDateTime.now());
        mentorRequestRepository.save(request);
    }

    // 승인요청 (멘토C)
    @Transactional
    public void requestApproval(Long requestId, Long reviewerId) {
        MentorCertificationRequests request = mentorRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("신청 내역 없음"));
        request.setStatus(MentorCertificationRequests.Status.REQUESTED);
        request.setReviewedBy(reviewerId);
        request.setReviewedAt(LocalDateTime.now());
        mentorRequestRepository.save(request);
    }


    // 반려(미승인)
    @Transactional
    public void rejectRequest(Long requestId, Long reviewerId, String reason) {
        MentorCertificationRequests request = mentorRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("신청 내역 없음"));

        // 상태 변경
        request.setStatus(MentorCertificationRequests.Status.REJECTED);
        request.setReviewedBy(reviewerId);
        request.setReviewedAt(LocalDateTime.now());

        // 반려 사유 저장
        request.setRejectionReason(reason);
        mentorRequestRepository.save(request);
    }
}
