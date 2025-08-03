// domain/dashboard/controller/PolicyHotController.java
package com.jibangyoung.domain.dashboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.dashboard.dto.PolicyHotRankDto;
import com.jibangyoung.domain.dashboard.service.PolicyHotRankService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "PolicyHot", description = "정책 인기(찜수) TOP 10 API")
@RestController
@RequestMapping("/api/dashboard/policyhot")
@RequiredArgsConstructor
public class PolicyHotController {

    private final PolicyHotRankService service;

    @Operation(summary = "정책 인기 TOP 10 (캐싱 기반)")
    @GetMapping("/top10")
    public ResponseEntity<List<PolicyHotRankDto>> getPolicyHotTop10() {
        List<PolicyHotRankDto> top10 = service.getTop10FromCache();
        return ResponseEntity.ok(top10);
    }
}
