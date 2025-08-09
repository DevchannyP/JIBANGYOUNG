package com.jibangyoung.domain.mentor.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.community.dto.PresignedUrlRequest;
import com.jibangyoung.domain.community.dto.PresignedUrlResponse;
import com.jibangyoung.domain.community.service.PresignedUrlService;
import com.jibangyoung.domain.mentor.dto.AdMentorLogListDTO;
import com.jibangyoung.domain.mentor.dto.AdMentorRejectRequestDTO;
import com.jibangyoung.domain.mentor.dto.AdMentorReportDTO;
import com.jibangyoung.domain.mentor.dto.AdMentorRequestDTO;
import com.jibangyoung.domain.mentor.dto.AdMentorUserDTO;
import com.jibangyoung.domain.mentor.dto.MentorApplicationRequestDto;
import com.jibangyoung.domain.mentor.dto.MentorApplicationResponseDto;
import com.jibangyoung.domain.mentor.dto.MentorNoticeCreateDto;
import com.jibangyoung.domain.mentor.dto.MentorNoticeDto;
import com.jibangyoung.domain.mentor.dto.MentorNoticeNavigationDto;
import com.jibangyoung.domain.mentor.service.AdMentorLogListService;
import com.jibangyoung.domain.mentor.service.AdMentorReportService;
import com.jibangyoung.domain.mentor.service.AdMentorRequestService;
import com.jibangyoung.domain.mentor.service.AdMentorUserService;
import com.jibangyoung.domain.mentor.service.MentorApplicationService;
import com.jibangyoung.domain.mentor.service.MentorNoticeService;
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
    private final AdMentorRequestService adMentorRequestService; 
    private final MentorApplicationService mentorApplicationService;
    private final PresignedUrlService presignedUrlService;
    private final MentorNoticeService mentorNoticeService;

    // 🔒 멘토 권한 전용
    @GetMapping("/local")
    @PreAuthorize("hasAnyRole('MENTOR_A', 'MENTOR_B', 'MENTOR_C', 'ADMIN')")
    public List<AdMentorUserDTO> getUsersByMentorRegion(@AuthenticationPrincipal CustomUserPrincipal loginUser) {
            boolean isAdmin = loginUser.getAuthorities().stream()
        .anyMatch(a -> {
            String auth = a.getAuthority();
            return "ADMIN".equals(auth) || "ROLE_ADMIN".equals(auth);
        });
        if (isAdmin) {
            return adMentorUserService.getAllMentorUsers();
        }

        return adMentorUserService.getAdMentorId(loginUser.getId());
    }

    @GetMapping("/logList")
    @PreAuthorize("hasAnyRole('MENTOR_A', 'MENTOR_B', 'ADMIN')")
    public List<AdMentorLogListDTO> getMentorLogList(@AuthenticationPrincipal CustomUserPrincipal loginUser) {
        boolean isAdmin = loginUser.getAuthorities().stream()
        .anyMatch(a -> {
            String auth = a.getAuthority();
            return "ADMIN".equals(auth) || "ROLE_ADMIN".equals(auth);
        });
        return adMentorLogListService.getMentorLogList(loginUser.getId(), isAdmin);
    }

    @GetMapping("/report")
    @PreAuthorize("hasAnyRole('MENTOR_A', 'MENTOR_B', 'MENTOR_C', 'ADMIN')")
    public List<AdMentorReportDTO> getMentorRegionReports(
            @AuthenticationPrincipal CustomUserPrincipal loginUser,
            @RequestParam("type") String type) {
        return adMentorReportService.getReportsByMentorRegionAndType(loginUser.getId(), type);
    }

    @PatchMapping("/report/{id}/status")
    @PreAuthorize("hasAnyRole('MENTOR_A', 'MENTOR_B', 'MENTOR_C', 'ADMIN')")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal CustomUserPrincipal loginUser) {
        adMentorReportService.updateReportStatus(id, request.get("status"), loginUser.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/request/list")
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR_A', 'MENTOR_B', 'MENTOR_C')")
    public ResponseEntity<ApiResponse<List<AdMentorRequestDTO>>> getMentorApplicationList(
            @AuthenticationPrincipal CustomUserPrincipal loginUser) {
        Long loginUserId = loginUser.getId();
        List<AdMentorRequestDTO> list = adMentorRequestService.getMentorRequestsByUserRegion(loginUserId);

        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PatchMapping("/request/{id}/approve/first")
    @PreAuthorize("hasAnyRole('MENTOR_B','MENTOR_A','ADMIN')")
    public ResponseEntity<?> approveFirst(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal loginUser) {
        adMentorRequestService.approveFirst(id, loginUser.getId());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/request/{id}/approve/second")
    @PreAuthorize("hasAnyRole('MENTOR_A', 'ADMIN')")
    public ResponseEntity<?> approveSecond(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal loginUser) {
        adMentorRequestService.approveSecond(id, loginUser.getId());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/request/{id}/request-approval")
    @PreAuthorize("hasAnyRole('MENTOR_C','MENTOR_B','MENTOR_A','ADMIN')")
    public ResponseEntity<?> requestApproval(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal loginUser) {
        adMentorRequestService.requestApproval(id, loginUser.getId());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/request/{id}/reject")
    @PreAuthorize("hasAnyRole('MENTOR_A','MENTOR_B','ADMIN')")
    public ResponseEntity<Void> rejectRequest(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserPrincipal loginUser,
        @Valid @RequestBody AdMentorRejectRequestDTO body
    ) {
        adMentorRequestService.rejectRequest(id, loginUser.getId(), body.getReason());
        return ResponseEntity.noContent().build();
    }

    // 🔓 일반 사용자 권한
    @PostMapping("/application")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<String>> applyMentor(@RequestBody @Valid MentorApplicationRequestDto requestDto) {
        mentorApplicationService.applyMentor(requestDto);
        return ResponseEntity.ok(ApiResponse.success("멘토 신청이 완료되었습니다."));
    }

    @GetMapping("/application/status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<MentorApplicationResponseDto>> getMentorApplicationStatus() {
        Optional<MentorApplicationResponseDto> status = mentorApplicationService.getMentorApplicationStatus();
        return status.map(dto -> ResponseEntity.ok(ApiResponse.success(dto)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/application/check")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Boolean>> checkMentorApplication() {
        boolean hasApplied = mentorApplicationService.hasAlreadyApplied();
        return ResponseEntity.ok(ApiResponse.success(hasApplied));
    }

    @PostMapping("/application/presign")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> getMentorDocumentPresignedUrl(
            @RequestBody PresignedUrlRequest request) {
        String fileName = "mentor-documents/" + request.getFileName();
        String presignedUrl = presignedUrlService.generatePresignedUrl(fileName, request.getContentType());
        String publicUrl = presignedUrlService.getPublicUrl(fileName);
        return ResponseEntity.ok(ApiResponse.success(new PresignedUrlResponse(presignedUrl, publicUrl)));
    }

    // 🔐 인증된 사용자 (공지사항 열람)
    @GetMapping("/notices")
    @PreAuthorize("hasAnyRole('MENTOR_A', 'MENTOR_B', 'MENTOR_C', 'ADMIN')")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<MentorNoticeDto>>> getMentorNotices(
            @RequestParam(required = false) Long regionId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        var notices = mentorNoticeService.getNoticesByRegion(regionId, page, size, keyword);
        return ResponseEntity.ok(ApiResponse.success(notices));
    }

    @GetMapping("/notices/{noticeId}")
    @PreAuthorize("hasAnyRole('MENTOR_A', 'MENTOR_B', 'MENTOR_C', 'ADMIN')")
    public ResponseEntity<ApiResponse<MentorNoticeNavigationDto>> getMentorNoticeDetail(@PathVariable Long noticeId) {
        var notice = mentorNoticeService.getNoticeWithNavigation(noticeId);
        return ResponseEntity.ok(ApiResponse.success(notice));
    }

    // 🔒 멘토 권한 필요 (작성)
    @PostMapping("/notices")
    @PreAuthorize("hasAnyRole('MENTOR_A', 'MENTOR_B', 'MENTOR_C', 'ADMIN')")
    public ResponseEntity<ApiResponse<Long>> createMentorNotice(@RequestBody @Valid MentorNoticeCreateDto createDto) {
        Long noticeId = mentorNoticeService.createNotice(createDto);
        return ResponseEntity.ok(ApiResponse.success(noticeId));
    }

    // 🔒 멘토 또는 관리자 (삭제)
    @PostMapping("/notices/{noticeId}/delete")
    @PreAuthorize("hasAnyRole('MENTOR_A', 'MENTOR_B', 'MENTOR_C', 'ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteMentorNotice(@PathVariable Long noticeId) {
        mentorNoticeService.deleteNotice(noticeId);
        return ResponseEntity.ok(ApiResponse.success("공지사항이 삭제되었습니다."));
    }

    // 🔐 인증된 사용자 (최근 공지)
    @GetMapping("/notices/recent")
    @PreAuthorize("hasAnyRole('MENTOR_A', 'MENTOR_B', 'MENTOR_C', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<MentorNoticeDto>>> getRecentMentorNotices(
            @RequestParam Long regionId,
            @RequestParam(defaultValue = "5") int limit) {
        List<MentorNoticeDto> notices = mentorNoticeService.getRecentNotices(regionId, limit);
        return ResponseEntity.ok(ApiResponse.success(notices));
    }
}
