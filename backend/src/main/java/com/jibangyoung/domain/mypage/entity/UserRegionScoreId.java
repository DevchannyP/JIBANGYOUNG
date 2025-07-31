package com.jibangyoung.domain.mypage.entity;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegionScoreId implements Serializable {
    private Long userId;
    private Integer regionId;
}
