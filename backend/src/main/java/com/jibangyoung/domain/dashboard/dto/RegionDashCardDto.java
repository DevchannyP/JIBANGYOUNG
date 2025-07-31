// dashboard/dto/RegionDashCardDto.java
package com.jibangyoung.domain.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RegionDashCardDto {
    private final Integer regionCode;
    private final String guGun1;
    private final String guGun2;
}