package com.jibangyoung.domain.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegionScoreRankingDto {
    private Long userId;
    private int score;
}
