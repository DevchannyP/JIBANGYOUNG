package com.jibangyoung.domain.community.dto;

import com.jibangyoung.domain.mypage.entity.ReportTargetType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
public class ReportCreateRequestDto {
    
    @NotNull(message = "신고 대상 타입은 필수입니다.")
    private ReportTargetType targetType;
    
    @NotNull(message = "신고 대상 ID는 필수입니다.")
    private Long targetId;
    
    @NotBlank(message = "신고 사유 코드는 필수입니다.")
    private String reasonCode;
    
    private String reasonDetail;
    
    public ReportCreateRequestDto(ReportTargetType targetType, Long targetId, 
                                String reasonCode, String reasonDetail) {
        this.targetType = targetType;
        this.targetId = targetId;
        this.reasonCode = reasonCode;
        this.reasonDetail = reasonDetail;
    }
    
}