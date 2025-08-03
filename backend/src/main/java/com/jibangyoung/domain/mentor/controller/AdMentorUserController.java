package com.jibangyoung.domain.mentor.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mentor.dto.AdMentorLogListDTO;
import com.jibangyoung.domain.mentor.dto.AdMentorReportDTO;
import com.jibangyoung.domain.mentor.dto.AdMentorUserDTO;
import com.jibangyoung.domain.mentor.service.AdMentorLogListService;
import com.jibangyoung.domain.mentor.service.AdMentorReportService;
import com.jibangyoung.domain.mentor.service.AdMentorUserService;
import com.jibangyoung.global.security.CustomUserPrincipal;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mentor")
public class AdMentorUserController {

    private final AdMentorUserService adMentorUserService;
    private final AdMentorLogListService adMentorLogListService;
    private final AdMentorReportService adMentorReportService;


    // 멘토 데시보드_내 지역 멘토 리스트
    @GetMapping("/local")
    public List<AdMentorUserDTO> getUsersByMentorRegion(
            @AuthenticationPrincipal CustomUserPrincipal loginUser
    ) {
        System.out.println("[성공] 로그인 유저: id=" + loginUser.getId());

        Long userId = loginUser.getId();
        return adMentorUserService.getAdMentorId(userId);
    }
    
    // 멘토 데시보드_멘토 활동로그 리스트 API
    @GetMapping("/logList")
    public List<AdMentorLogListDTO> getMentorLogList(
            @AuthenticationPrincipal CustomUserPrincipal loginUser
    ) {
        Long userId = loginUser.getId();
        return adMentorLogListService.getMentorLogList(userId);
    }
    // 멘토가 자신의 지역 신고내역을 조회
    @GetMapping("/report")
    public List<AdMentorReportDTO> getMentorRegionReports(
        @AuthenticationPrincipal CustomUserPrincipal loginUser,
        @RequestParam("type") String type
    ) {
        Long mentorUserId = loginUser.getId();
        System.out.println("[컨트롤러] mentorUserId: " + mentorUserId);
        System.out.println("[컨트롤러] type 파라미터: " + type);

        return adMentorReportService.getReportsByMentorRegionAndType(mentorUserId, type);
    }
}
