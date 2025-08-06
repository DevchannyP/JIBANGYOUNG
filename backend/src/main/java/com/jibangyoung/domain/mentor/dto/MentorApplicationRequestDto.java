package com.jibangyoung.domain.mentor.dto;

import com.jibangyoung.domain.mentor.entity.MentorCertificationRequests;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorApplicationRequestDto {

    @NotNull(message = "지역을 선택해주세요.")
    private Long regionId;
    
    @NotBlank(message = "신청 사유를 입력해주세요.")
    private String reason;
    
    @NotNull(message = "행정기관 여부를 선택해주세요.")
    private Boolean governmentAgency;
    
    private String documentUrl;

    public MentorCertificationRequests toEntity(Long userId, String userName, String userEmail) {
        MentorCertificationRequests request = MentorCertificationRequests.builder()
                .userId(userId)
                .userName(userName)
                .userEmail(userEmail)
                .regionId(regionId)
                .reason(reason)
                .governmentAgency(governmentAgency)
                .documentUrl(documentUrl)
                .status(MentorCertificationRequests.Status.PENDING)
                .build();
        
        return request;
    }
}