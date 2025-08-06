package com.jibangyoung.domain.mentor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorNoticeNavigationDto {
    
    private MentorNoticeDto current;
    private NavigationItem previous;
    private NavigationItem next;
    
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NavigationItem {
        private Long id;
        private String title;
    }
}