package com.jibangyoung.domain.mentor.service;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.mentor.dto.MentorApplicationRequestDto;
import com.jibangyoung.domain.mentor.dto.MentorApplicationResponseDto;
import com.jibangyoung.domain.mentor.entity.MentorCertificationRequests;
import com.jibangyoung.domain.mentor.repository.MentorCertificationRequestsRepository;
import com.jibangyoung.global.exception.BusinessException;
import com.jibangyoung.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentorApplicationService {
    
    private final MentorCertificationRequestsRepository mentorRequestRepository;
    private final UserRepository userRepository;

    @Transactional
    public void applyMentor(MentorApplicationRequestDto requestDto, Long userId) {
        // 사용자 정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 이미 신청한 경우 예외 처리
        if (mentorRequestRepository.existsByUserId(userId)) {
            throw new BusinessException(ErrorCode.ALREADY_APPLIED_MENTOR);
        }
        
        // 멘토 신청 엔티티 생성 및 저장
        MentorCertificationRequests application = requestDto.toEntity(
                userId, 
                user.getUsername(), 
                user.getEmail()
        );
        
        mentorRequestRepository.save(application);
        
        log.info("멘토 신청 완료 - 사용자 ID: {}, 사용자명: {}", userId, user.getUsername());
    }


    @Transactional(readOnly = true)
    public Optional<MentorApplicationResponseDto> getMentorApplicationStatus(Long userId) {
        return mentorRequestRepository.findByUserId(userId)
                .map(MentorApplicationResponseDto::from);
    }
    
    @Transactional(readOnly = true)
    public boolean hasAlreadyApplied(Long userId) {
        return mentorRequestRepository.existsByUserId(userId);
    }
}