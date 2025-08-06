package com.jibangyoung.domain.mentor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdMentorLogListDTO {
    private Long userId;
    private String nickname;
    private String role;
    private String roleDescription;       
    private Long regionId;
    private int postCount;
    private int noticeCount;
    private int commentCount;
    private int approvedCount;
    private int ignoredCount;
    private int invalidCount;
    private int pendingCount;
    private int rejectedCount;
    private int requestedCount;
}
