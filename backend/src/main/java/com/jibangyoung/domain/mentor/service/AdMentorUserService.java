package com.jibangyoung.domain.mentor.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.mentor.dto.AdMentorUserDTO;
import com.jibangyoung.domain.mentor.repository.AdMentorUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdMentorUserService {

    private final AdMentorUserRepository adMentorUserRepository;

    // 멘토 데시보드_유저 상태제어 리스트(동일 지역유저)
    public List<AdMentorUserDTO> getAdMentorId(Long mentorId) {
        // 로그인한 멘토 유저 조회
        User mentor = adMentorUserRepository.findById(mentorId)
            .orElseThrow(() -> new RuntimeException("멘토 유저 없음"));

        // 로그인한 멘토와 같은 지역(region) 유저 모두 조회
        String mentorRegion = mentor.getRegion();
        List<User> userList = adMentorUserRepository.findByRegion(mentorRegion);

        return userList.stream()
            .map(user -> new AdMentorUserDTO(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getRole().name(),
                user.getEmail(),
                user.getPhone(),
                user.getRegion(),
                user.getStatus().name()
            ))
            .collect(Collectors.toList());
    }

}