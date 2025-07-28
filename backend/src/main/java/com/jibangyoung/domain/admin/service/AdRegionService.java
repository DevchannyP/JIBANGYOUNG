package com.jibangyoung.domain.admin.service;

import com.jibangyoung.domain.admin.dto.AdRegionDTO;
import com.jibangyoung.domain.admin.repository.AdRegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdRegionService {
    private final AdRegionRepository regionRepository;

    public List<AdRegionDTO> getSidoList() {
        return regionRepository.findDistinctSidoList().stream()
                .map(dto -> new AdRegionDTO(
                        dto.getRegion_code(),
                        dto.getSido().replaceAll("특별시|광역시|도", "")
                ))
                .collect(Collectors.toList());
    }
}
