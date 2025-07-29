package com.jibangyoung.domain.admin.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.admin.dto.AdRegionDTO;
import com.jibangyoung.domain.admin.repository.AdRegionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdRegionService {
    private final AdRegionRepository regionRepository;

    public List<AdRegionDTO> getSidoList() {
        return regionRepository.findDistinctSidoList().stream()
            .filter(dto -> 
            dto.getRegion_code() % 1000 == 0 || 
            dto.getRegion_code() == 36110 ) // 세종시
            .map(dto -> new AdRegionDTO(
                dto.getRegion_code(),
                dto.getSido().replaceAll("특별시|광역시|시", "")
            ))
            .collect(Collectors.toList());
    }
}
