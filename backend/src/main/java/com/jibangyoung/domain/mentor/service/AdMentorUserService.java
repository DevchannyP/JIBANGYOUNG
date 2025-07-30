package com.jibangyoung.domain.mentor.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.mentor.dto.AdMentorUserDTO;
import com.jibangyoung.domain.mentor.repository.AdMentorUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdMentorUserService {

    private final AdMentorUserRepository adMentorUserRepository;

    // 멘토 데시보드_내 지역 멘토 리스트
    public List<AdMentorUserDTO> getAdMentorId(Long mentorId) {
        List<AdMentorUserDTO> mentorUsers = adMentorUserRepository.findUsersByMentorRegion(mentorId);
        return mentorUsers;
    }
}
