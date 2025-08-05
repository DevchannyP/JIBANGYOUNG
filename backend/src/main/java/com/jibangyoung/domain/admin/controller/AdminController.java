package com.jibangyoung.domain.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.admin.dto.AdPostDTO;
import com.jibangyoung.domain.admin.dto.AdRegionDTO;
import com.jibangyoung.domain.admin.dto.AdReportDto;
import com.jibangyoung.domain.admin.dto.AdUserDTO;
import com.jibangyoung.domain.admin.dto.AdUserRoleDTO;
import com.jibangyoung.domain.admin.service.AdPostService;
import com.jibangyoung.domain.admin.service.AdRegionService;
import com.jibangyoung.domain.admin.service.AdReportService;
import com.jibangyoung.domain.admin.service.AdUserService;
import com.jibangyoung.domain.auth.entity.UserRole;
import com.jibangyoung.global.security.CustomUserPrincipal;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdUserService userService;
    private final AdPostService postService;
    private final AdRegionService regionService;
    private final AdReportService adReportService; 

    // 어드민 권한 체크 유틸
    private void checkAdmin(CustomUserPrincipal loginUser) {
        if (!UserRole.ADMIN.equals(loginUser.getRole())) {
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        }
    }

    // [유저관리]
    @GetMapping("/users")
    public List<AdUserDTO> getAllUsers(@AuthenticationPrincipal CustomUserPrincipal loginUser) {
        checkAdmin(loginUser);
        return userService.getAllUsers();
    }

    @PutMapping("/users/roles")
    public ResponseEntity<Void> updateUserRoles(
        @RequestBody List<AdUserRoleDTO> roleList,
        @AuthenticationPrincipal CustomUserPrincipal loginUser) {
        checkAdmin(loginUser);
        userService.updateRoles(roleList);
        return ResponseEntity.ok().build();
    }

    // [게시글관리]
    @GetMapping("/posts")
    public List<AdPostDTO> getAllPosts(@AuthenticationPrincipal CustomUserPrincipal loginUser) {
        checkAdmin(loginUser);
        return postService.getAllPosts();
    }

    // [시/도 목록 반환]
    @GetMapping("/region")
    public List<AdRegionDTO> getSidoList() {
        return regionService.getSidoList();
    }

    // [신고관리] 1. 요청된(REQUESTED) 신고 목록 조회 (관리자)
    @GetMapping("/report")
    public List<AdReportDto> getRequestedReports(
        @AuthenticationPrincipal CustomUserPrincipal loginUser,
        @RequestParam("type") String type
    ) {
        checkAdmin(loginUser);
        Long adminUserId = loginUser.getId();
        return adReportService.getRequestedReports(adminUserId, type);
    }

    // [신고관리] 2. 신고 상태 변경 (승인/반려)
    @PatchMapping("/report/{id}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal CustomUserPrincipal loginUser
    ) {
        checkAdmin(loginUser);
        String status = request.get("status");
        Long adminId = loginUser.getId();
        adReportService.updateReportStatus(id, status, adminId);
        return ResponseEntity.ok().build();
    }
}
