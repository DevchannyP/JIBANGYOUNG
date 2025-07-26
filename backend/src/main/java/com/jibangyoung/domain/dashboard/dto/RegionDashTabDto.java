// dashboard/dto/RegionDashTabDto.java
package com.jibangyoung.domain.dashboard.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RegionDashTabDto {
    private final String sido;
    private final List<RegionDashCardDto> regions;
}