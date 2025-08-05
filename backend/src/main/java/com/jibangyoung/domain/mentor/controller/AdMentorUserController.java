package com.jibangyoung.domain.mentor.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.mentor.dto.AdMentorLogListDTO;
import com.jibangyoung.domain.mentor.dto.AdMentorReportDTO;
import com.jibangyoung.domain.mentor.dto.AdMentorUserDTO;
import com.jibangyoung.domain.mentor.dto.MentorApplicationRequestDto;
import com.jibangyoung.domain.mentor.dto.MentorApplicationResponseDto;
import com.jibangyoung.domain.mentor.dto.MentorNoticeCreateDto;
import com.jibangyoung.domain.mentor.dto.MentorNoticeDto;
import com.jibangyoung.domain.mentor.dto.MentorNoticeNavigationDto;
import com.jibangyoung.domain.mentor.service.AdMentorLogListService;
import com.jibangyoung.domain.mentor.service.AdMentorReportService;
import com.jibangyoung.domain.mentor.service.AdMentorUserService;
import com.jibangyoung.domain.mentor.service.MentorApplicationService;
import com.jibangyoung.domain.mentor.service.MentorNoticeService;
import com.jibangyoung.domain.community.dto.PresignedUrlRequest;
import com.jibangyoung.domain.community.dto.PresignedUrlResponse;
import com.jibangyoung.domain.community.service.PresignedUrlService;
import com.jibangyoung.global.common.ApiResponse;
import com.jibangyoung.global.security.CustomUserPrincipal;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mentor")
public class AdMentorUserController {

    private final AdMentorUserService adMentorUserService;
    private final AdMentorLogListService adMentorLogListService;
    private final AdMentorReportService adMentorReportService;
    private final MentorApplicationService mentorApplicationService;
    private final PresignedUrlService presignedUrlService;
    private final MentorNoticeService mentorNoticeService;

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
    
    // === 멘토 신청 관련 API ===
    
    // 멘토 신청
    @PostMapping("/application")
    public ResponseEntity<ApiResponse<String>> applyMentor(
            @RequestBody @Valid MentorApplicationRequestDto requestDto) {
        
        try {
            mentorApplicationService.applyMentor(requestDto);
            return ResponseEntity.ok(ApiResponse.success("멘토 신청이 완료되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 멘토 신청 상태 조회
    @GetMapping("/application/status")
    public ResponseEntity<ApiResponse<MentorApplicationResponseDto>> getMentorApplicationStatus() {
        
        try {
            Optional<MentorApplicationResponseDto> status = mentorApplicationService.getMentorApplicationStatus();
            
            if (status.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success(status.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 멘토 신청 여부 확인
    @GetMapping("/application/check")
    public ResponseEntity<ApiResponse<Boolean>> checkMentorApplication() {
        
        try {
            boolean hasApplied = mentorApplicationService.hasAlreadyApplied();
            return ResponseEntity.ok(ApiResponse.success(hasApplied));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 멘토 신청용 파일 업로드 presigned URL 발급
    @PostMapping("/application/presign")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> getMentorDocumentPresignedUrl(
            @RequestBody PresignedUrlRequest request) {
        
        try {
            String fileName = "mentor-documents/" + request.getFileName();
            String presignedUrl = presignedUrlService.generatePresignedUrl(fileName, request.getContentType());
            String publicUrl = presignedUrlService.getPublicUrl(fileName);
            
            PresignedUrlResponse response = new PresignedUrlResponse(presignedUrl, publicUrl);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // === 멘토 공지사항 관련 API ===
    
    // 멘토 공지사항 목록 조회
    @GetMapping("/notices")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<MentorNoticeDto>>> getMentorNotices(
            @RequestParam(required = false) Long regionId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        
        try {
            org.springframework.data.domain.Page<MentorNoticeDto> notices = 
                mentorNoticeService.getNoticesByRegion(regionId, page, size, keyword);
            return ResponseEntity.ok(ApiResponse.success(notices));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 멘토 공지사항 상세 조회 (네비게이션 포함)
    @GetMapping("/notices/{noticeId}")
    public ResponseEntity<ApiResponse<MentorNoticeNavigationDto>> getMentorNoticeDetail(
            @PathVariable Long noticeId) {
        
        try {
            MentorNoticeNavigationDto notice = mentorNoticeService.getNoticeWithNavigation(noticeId);
            return ResponseEntity.ok(ApiResponse.success(notice));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 멘토 공지사항 작성
    @PostMapping("/notices")
    public ResponseEntity<ApiResponse<Long>> createMentorNotice(
            @RequestBody @Valid MentorNoticeCreateDto createDto) {
        
        try {
            Long noticeId = mentorNoticeService.createNotice(createDto);
            return ResponseEntity.ok(ApiResponse.success(noticeId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 멘토 공지사항 삭제
    @PostMapping("/notices/{noticeId}/delete")
    public ResponseEntity<ApiResponse<String>> deleteMentorNotice(
            @PathVariable Long noticeId) {
        
        try {
            mentorNoticeService.deleteNotice(noticeId);
            return ResponseEntity.ok(ApiResponse.success("공지사항이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 최신 멘토 공지사항 조회 (대시보드용)
    @GetMapping("/notices/recent")
    public ResponseEntity<ApiResponse<java.util.List<MentorNoticeDto>>> getRecentMentorNotices(
            @RequestParam Long regionId,
            @RequestParam(defaultValue = "5") int limit) {
        
        try {
            java.util.List<MentorNoticeDto> notices = 
                mentorNoticeService.getRecentNotices(regionId, limit);
            return ResponseEntity.ok(ApiResponse.success(notices));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
