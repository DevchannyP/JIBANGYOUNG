package com.jibangyoung.domain.mentor.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mentor.dto.MentorApplicationResponseDto;
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

    // 필요하면 상태변경 등 메서드도 여기에 추가!
}
