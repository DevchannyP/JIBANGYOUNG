package com.jibangyoung.domain.policy.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PolicyCardDto {

    @JsonProperty("NO")
    private Integer NO;
    private String plcy_nm;
    private String aply_ymd;
    private String sidoName;
    private String plcy_kywd_nm;
    private String plcy_no;
    private LocalDate deadline;
    private long d_day; // 마감까지 남은 일수
    private int favorites; // 총 추천수
}