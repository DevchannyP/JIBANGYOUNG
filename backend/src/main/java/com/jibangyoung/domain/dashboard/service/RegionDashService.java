// dashboard/service/RegionDashService.java
package com.jibangyoung.domain.dashboard.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jibangyoung.domain.dashboard.dto.RegionDashCardDto;
import com.jibangyoung.domain.dashboard.dto.RegionDashTabDto;
import com.jibangyoung.domain.dashboard.entity.RegionDashEntity;
import com.jibangyoung.domain.dashboard.repository.RegionDashRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegionDashService {
    private final RegionDashRepository regionDashRepository;

    // [캐싱] 전체 시도 리스트 (슬라이더/탭)
    @Cacheable(value = "dashboard:regiondash:sidoTabs", unless = "#result == null || #result.isEmpty()")
    public List<String> getSidoTabs() {
        return regionDashRepository.findAllSidoDistinct();
    }

    // [캐싱] 특정 시도에 대한 구/군 리스트 (카드)
    @Cacheable(value = "dashboard:regiondash:tabCards", key = "#sido", unless = "#result == null")
    public RegionDashTabDto getRegionTab(String sido) {
        List<RegionDashEntity> entities = regionDashRepository.findBySidoOrderByGuGun1Asc(sido);
        List<RegionDashCardDto> cards = entities.stream()
                .map(e -> RegionDashCardDto.builder()
                        .regionCode(e.getRegionCode())
                        .guGun1(e.getGuGun1())
                        .guGun2(e.getGuGun2())
                        .build())
                .collect(Collectors.toList());
        return RegionDashTabDto.builder()
                .sido(sido)
                .regions(cards)
                .build();
    }
}
