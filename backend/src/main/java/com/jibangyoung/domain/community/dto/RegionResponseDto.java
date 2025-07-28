package com.jibangyoung.domain.community.dto;

import com.jibangyoung.domain.policy.entity.Region;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionResponseDto {
    private Integer regionCode;
    private String sido;
    private String guGun;

    public  static RegionResponseDto from(Region region) {
        return RegionResponseDto.builder()
                .regionCode(region.getRegionCode())
                .sido(region.getSido())
                .guGun(region.getGuGun1())
                .build();
    }
}
