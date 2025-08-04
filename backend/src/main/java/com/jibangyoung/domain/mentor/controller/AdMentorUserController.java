package com.jibangyoung.domain.mentor.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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
    // 멘토 데시보드_신고목록
    @GetMapping("/report")
    public List<AdMentorReportDTO> getMentorRegionReports(
        @AuthenticationPrincipal CustomUserPrincipal loginUser,
        @RequestParam("type") String type
    ) {
        Long mentorUserId = loginUser.getId();
        System.out.println("멘토 userId: " + mentorUserId); // 👈 콘솔에 찍어서 확인
        return adMentorReportService.getReportsByMentorRegionAndType(mentorUserId, type);
    }
    // 멘토 데시보드_신고목록(상태변경)
    @PatchMapping("/report/{id}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal CustomUserPrincipal loginUser
    ) {
        System.out.println("PATCH 진입");
        String status = request.get("status");
        Long reviewedBy = loginUser.getId();
        adMentorReportService.updateReportStatus(id, status, reviewedBy);
        return ResponseEntity.ok().build();
    }
}
