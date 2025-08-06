package com.jibangyoung.domain.policy.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.policy.dto.PolicyCardDto;
import com.jibangyoung.domain.policy.dto.PolicyFavoriteDto;
import com.jibangyoung.domain.policy.service.PolicyFavoriteService;
import com.jibangyoung.domain.policy.service.PolicyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/policy")
@RequiredArgsConstructor
public class PolicyFavoriteController {

    private final PolicyFavoriteService policyFavoriteService;
    private final PolicyService policyService;

    @PostMapping("/sync")
    public ResponseEntity<String> syncBookmarks(@RequestBody PolicyFavoriteDto request) {
        try {
            policyFavoriteService.syncBookmarks(request.userId(), request.bookmarkedPolicyIds());
            return ResponseEntity.ok("북마크가 성공적으로 동기화되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("북마크 동기화 실패: " + e.getMessage());
        }
    }

    // ✅ userId에 해당하는 북마크된 정책코드 리스트 조회
    @GetMapping("/favorites/{userId}")
    public ResponseEntity<List<Long>> getBookmarkedPolicyCodes(@PathVariable Long userId) {
        try {
            List<Long> bookmarkedPolicyCodes = policyFavoriteService.findPolicyCodesByUserId(userId);
            return ResponseEntity.ok(bookmarkedPolicyCodes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ 프론트가 policy NO 리스트를 보내면 정책 상세 리스트 반환
    @PostMapping("/favorites/policylist")
    public List<PolicyCardDto> getPoliciesByNos(@RequestBody List<Integer> policyNos) {
        return policyService.getPoliciesByCodes(policyNos);
    }
}
