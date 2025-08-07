package com.jibangyoung.domain.mentor.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mentor.dto.MentorApplicationResponseDto;
import com.jibangyoung.domain.mentor.entity.MentorCertificationRequests;
import com.jibangyoung.domain.mentor.repository.MentorCertificationRequestsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdMentorRequestService {

    private final MentorCertificationRequestsRepository mentorRequestRepository;

    // 멘토 신청 전체 리스트
    @Transactional(readOnly = true)
    public List<MentorApplicationResponseDto> getAllMentorRequests() {
        return mentorRequestRepository.findAll().stream()
                .map(MentorApplicationResponseDto::from)
                .collect(Collectors.toList());
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
    public void rejectRequest(Long requestId, Long reviewerId) {
        MentorCertificationRequests request = mentorRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("신청 내역 없음"));
        request.setStatus(MentorCertificationRequests.Status.REJECTED);
        request.setReviewedBy(reviewerId);
        request.setReviewedAt(LocalDateTime.now());
        mentorRequestRepository.save(request);
    }
}
