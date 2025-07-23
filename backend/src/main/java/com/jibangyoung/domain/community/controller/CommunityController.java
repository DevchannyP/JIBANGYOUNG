package com.jibangyoung.domain.community.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.community.dto.PostListDto;
import com.jibangyoung.domain.community.service.CommunityService;
@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping("/top-liked-week")
    public List<PostListDto> topLikeWeek() {
        return communityService.getCachedWeekTop10();
    }
    @GetMapping("/top-liked-today")
    public List<PostListDto> topLikeToday() {
        return communityService.getCachedTodayTop10();
    }


}
