package com.jibangyoung.domain.community.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.community.dto.PostListDto;
import com.jibangyoung.domain.community.service.CommunityService;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@RestController
@RequestMapping("/api/community")
@NoArgsConstructor
@AllArgsConstructor
public class CommunityController {

    CommunityService communityService;

    // @GetMapping("/top-liked-week")
    // public List<PostListDto> topLikeToday() {
    //     return communityService.getRecentTop10(null);
    // }
}
