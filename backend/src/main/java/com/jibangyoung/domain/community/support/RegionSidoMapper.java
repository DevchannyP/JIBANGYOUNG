package com.jibangyoung.domain.community.support;

import java.util.Map;

public class RegionSidoMapper {
    private static final Map<String, String> SIDO_MAP = Map.ofEntries(
            Map.entry("11", "서울"),
            Map.entry("26", "부산"),
            Map.entry("27", "대구"),
            Map.entry("28", "인천"),
            Map.entry("29", "광주"),
            Map.entry("30", "대전"),
            Map.entry("31", "울산"),
            Map.entry("36", "세종시"),
            Map.entry("41", "경기"),
            Map.entry("43", "충북"),
            Map.entry("44", "충남"),
            Map.entry("46", "전남"),
            Map.entry("47", "경북"),
            Map.entry("48", "경남"),
            Map.entry("50", "제주"),
            Map.entry("51", "강원"),
            Map.entry("52", "전북"),
            Map.entry("99", "전국")
    );

    public static String getRegionName(Long regionId) {
        if (regionId == null) return "알 수 없음";
        String prefix = String.valueOf(regionId).substring(0, 2);
        return SIDO_MAP.getOrDefault(prefix, "알 수 없음");
    }
}
