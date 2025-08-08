package com.jibangyoung.domain.mentor.dto;

import java.time.LocalDateTime;

import com.jibangyoung.domain.mentor.entity.MentorCertificationRequests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdMentorRequestDTO {
    
    private Long id;
    private Long userId;
    private String userName;
    private String nickname;
    private String userEmail;
    private Long regionId;
    private String reason;
    private Boolean governmentAgency;
    private String documentUrl;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private Long reviewedBy;
    private String rejectionReason;

    public static AdMentorRequestDTO from(MentorCertificationRequests entity, String nickname) {
        return AdMentorRequestDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .userName(entity.getUserName())
                .nickname(nickname) 
                .userEmail(entity.getUserEmail())
                .regionId(entity.getRegionId())
                .reason(entity.getReason())
                .governmentAgency(entity.getGovernmentAgency())
                .documentUrl(entity.getDocumentUrl())
                .status(entity.getStatus().name())
                .createdAt(entity.getCreatedAt())
                .reviewedAt(entity.getReviewedAt())
                .reviewedBy(entity.getReviewedBy())
                .rejectionReason(entity.getRejectionReason())
                .build();
    }
}