// dashboard/entity/RegionDashEntity.java
package com.jibangyoung.domain.dashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "region", indexes = {
        @Index(name = "idx_sido", columnList = "sido"),
        @Index(name = "idx_gu_gun_1", columnList = "gu_gun_1")
})
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class RegionDashEntity {
    @Id
    @Column(name = "region_code")
    private Integer regionCode;

    @Column(nullable = false, length = 16)
    private String sido;

    @Column(name = "gu_gun_1", length = 32)
    private String guGun1;

    @Column(name = "gu_gun_2", length = 32)
    private String guGun2;
}
