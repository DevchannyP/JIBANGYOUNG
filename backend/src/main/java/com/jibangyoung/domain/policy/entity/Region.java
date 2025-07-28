package com.jibangyoung.domain.policy.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "region")
@Getter
@Setter
public class Region {

    @Id
    @Column(name = "region_code")
    private Integer regionCode;

    @Column(name = "sido", length = 15)
    private String sido;

    @Column(name = "gu_gun_1", length = 10)
    private String guGun1;

    @Column(name = "gu_gun_2", length = 10)
    private String guGun2;
}
