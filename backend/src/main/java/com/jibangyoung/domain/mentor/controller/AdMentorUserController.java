package com.jibangyoung.domain.mentor.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mentor.dto.AdMentorUserDTO;
import com.jibangyoung.domain.mentor.service.AdMentorUserService;
import com.jibangyoung.global.security.CustomUserPrincipal;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mentor")
public class AdMentorUserController {

    private final AdMentorUserService adMentorUserService;

    // 멘토 데시보드_유저 상태제어 리스트(동일 지역유저)
    @GetMapping("/region")
    public List<AdMentorUserDTO> getUsersByMentorRegion(
            @AuthenticationPrincipal CustomUserPrincipal loginUser
    ) {
        // principal에서 로그인 한 유저 id 추출
        Long userId = loginUser.getId();
        return adMentorUserService.getAdMentorId(userId);
    }
}
