// src/main/java/com/jibangyoung/domain/dashboard/controller/MonthlyHotPostController.java

package com.jibangyoung.domain.dashboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.dashboard.dto.MonthlyHotPostDto;
import com.jibangyoung.domain.dashboard.service.MonthlyHotPostService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Dashboard", description = "대시보드 월간 인기글 API")
@RestController
@RequestMapping("/api/dashboard/monthly-hot")
@RequiredArgsConstructor
public class MonthlyHotPostController {

    private final MonthlyHotPostService service;

    @Operation(summary = "월간 인기글 TOP 10 조회 (캐싱)")
    @GetMapping("/top10")
    public ResponseEntity<List<MonthlyHotPostDto>> getMonthlyHotTop10() {
        return ResponseEntity.ok(service.getMonthlyHotTop10());
    }
}
