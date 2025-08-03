// domain/dashboard/dto/PolicyHotRankDto.java
package com.jibangyoung.domain.dashboard.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PolicyHotRankDto {
    @Schema(description = "정책 순위 (01~10)")
    private String no; // "01", "02", ...

    @Schema(description = "정책 ID")
    private Integer id;

    @Schema(description = "정책명")
    private String name;

    @Schema(description = "지역명")
    private String region;

    @Schema(description = "찜 수")
    private String value;
}
