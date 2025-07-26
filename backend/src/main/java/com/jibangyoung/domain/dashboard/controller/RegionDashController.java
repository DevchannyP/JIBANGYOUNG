// dashboard/controller/RegionDashController.java
package com.jibangyoung.domain.dashboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.dashboard.dto.RegionDashTabDto;
import com.jibangyoung.domain.dashboard.service.RegionDashService;
import com.jibangyoung.global.dto.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard/region")
@RequiredArgsConstructor
public class RegionDashController {
    private final RegionDashService regionDashService;

    @GetMapping("/tabs")
    @Operation(summary = "전체 시도(탭/슬라이더)명 목록 조회")
    public ApiResponse<List<String>> getSidoTabs() {
        return ApiResponse.success(regionDashService.getSidoTabs());
    }

    @GetMapping("/tab/{sido}")
    @Operation(summary = "특정 시도의 구/군 카드 목록 조회")
    public ApiResponse<RegionDashTabDto> getRegionTab(@PathVariable String sido) {
        return ApiResponse.success(regionDashService.getRegionTab(sido));
    }
}
