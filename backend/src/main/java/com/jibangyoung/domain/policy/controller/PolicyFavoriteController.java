package com.jibangyoung.domain.policy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.policy.dto.PolicyFavoriteDto;
import com.jibangyoung.domain.policy.service.PolicyFavoriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/policy")
@RequiredArgsConstructor
public class PolicyFavoriteController {

    private final PolicyFavoriteService policyFavoriteService;

    @PostMapping("/sync")
    public ResponseEntity<String> syncBookmarks(@RequestBody PolicyFavoriteDto request) {
        try {
            policyFavoriteService.syncBookmarks(request.userId(), request.bookmarkedPolicyIds());
            return ResponseEntity.ok("북마크가 성공적으로 동기화되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("북마크 동기화 실패: " + e.getMessage());
        }
    }
}
