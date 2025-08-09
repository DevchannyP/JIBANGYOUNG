package com.jibangyoung.domain.admin.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.admin.repository.AdMentorRequestRepository;
import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.entity.UserRole;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.mentor.dto.AdMentorRequestDTO;
import com.jibangyoung.domain.mentor.entity.MentorCertificationRequests;
import com.jibangyoung.domain.mentor.entity.MentorTest;
import com.jibangyoung.domain.mentor.repository.AdMentorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdRequestService {

    private final AdMentorRequestRepository adMentorRequestRepository;
    private final AdMentorRepository mentorTestRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AdMentorRequestDTO> getAllMentorRequests() {
        return adMentorRequestRepository.findAllAsDto();
    }
    @Transactional
    public void approveFinal(Long requestId, Long reviewerId) {
        MentorCertificationRequests req = adMentorRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("신청 내역 없음"));

        // 멘토 프로필_최종 승인 처리
        LocalDateTime now = LocalDateTime.now();
        req.setStatus(MentorCertificationRequests.Status.FINAL_APPROVED);
        // req.setReviewedBy(reviewerId);
        req.setReviewedAt(now);
        adMentorRequestRepository.save(req);

        // 멘토 프로필_중복체크
        Long userId = req.getUserId();
        Long regionId = req.getRegionId();

        boolean exists = mentorTestRepository.existsByUserIdAndRegionId(userId, regionId);
        if (!exists) {
            MentorTest profile = new MentorTest();
            profile.setUserId(userId);
            profile.setRegionId(regionId);
            profile.setLevelAcquiredAt(now);   
            profile.setCreatedAt(now);
            profile.setUpdatedAt(now);        
            profile.setCurrentScore(0);
            profile.setWarningCount(0);
            profile.setIsCertifiedByPublic(false); 
            profile.setIsActive(true);             
            mentorTestRepository.save(profile);
        }
        // MENTOR_C 승격
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저 정보 없음"));
        if (user.getRole() != UserRole.MENTOR_C) {
            user.changeRole(UserRole.MENTOR_C);
            userRepository.save(user);
        }
    }
}
