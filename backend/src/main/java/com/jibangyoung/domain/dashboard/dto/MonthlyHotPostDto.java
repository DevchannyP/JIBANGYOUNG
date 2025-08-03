// src/main/java/com/jibangyoung/domain/dashboard/dto/MonthlyHotPostDto.java

package com.jibangyoung.domain.dashboard.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "월간 인기글 Top10 DTO")
public class MonthlyHotPostDto {
    @Schema(description = "포스트 ID")
    private Long id;

    @Schema(description = "순위(01~10)")
    private String no;

    @Schema(description = "제목")
    private String title;

    @Schema(description = "글쓴이(닉네임)")
    private String author;

    @Schema(description = "조회수")
    private int views;

    @Schema(description = "추천수")
    private int likes;

    @Schema(description = "지역 코드")
    private Integer regionId;

    @Schema(description = "지역 이름(시도)")
    private String regionName;
}
