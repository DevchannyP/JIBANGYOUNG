package com.jibangyoung.domain.policy.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "policies_view")
@Getter
public class PolicyView {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int No;

    @Column(name = "plcyNm", nullable = false, length = 255)
    private String plcyNm;

    @Column(name = "bizPrdEtcCn", columnDefinition = "TEXT")
    private String bizPrdEtcCn;

    @Column(name = "aplyYmd", length = 50)
    private String aplyYmd;

    @Column(name = "ptcpPrpTrgtCn", columnDefinition = "TEXT")
    private String ptcpPrpTrgtCn;

    @Column(name = "refUrlAddr1", length = 500)
    private String refUrlAddr1;

    @Column(name = "zipCd", length = 10)
    private String zipCd;

    @Column(name = "refUrlAddr2", length = 500)
    private String refUrlAddr2;

    @Column(name = "mclsfNm", length = 50)
    private String mclsfNm;

    @Column(name = "lclsfNm", length = 50)
    private String lclsfNm;

    @Column(name = "sprtSclCnt")
    private Integer sprtSclCnt;

    @Column(name = "plcyAplyMthdCn", columnDefinition = "TEXT")
    private String plcyAplyMthdCn;

    @Column(name = "plcyKywdNm", length = 100)
    private String plcyKywdNm;

    @Column(name = "addAplyQlfcCndCn", columnDefinition = "TEXT")
    private String addAplyQlfcCndCn;

    @Column(name = "sprtTrgtMaxAge")
    private Integer sprtTrgtMaxAge;

    @Column(name = "operInstNm", length = 100)
    private String operInstNm;

    @Column(name = "sprvsnInstNm", length = 100)
    private String sprvsnInstNm;

    @Column(name = "aplyUrlAddr", length = 500)
    private String aplyUrlAddr;

    @Column(name = "plcyExplnCn", columnDefinition = "TEXT")
    private String plcyExplnCn;

    @Column(name = "plcySprtCn", columnDefinition = "TEXT")
    private String plcySprtCn;

    @Column(name = "pvsnInstGroupCd", length = 20)
    private String pvsnInstGroupCd;

    @Column(name = "sprtTrgtMinAge")
    private Integer sprtTrgtMinAge;

    @Column(name = "etcMttrCn", columnDefinition = "TEXT")
    private String etcMttrCn;

    @Column(name = "sbmsnDcmntCn", columnDefinition = "TEXT")
    private String sbmsnDcmntCn;

    @Column(name = "srngMthdCn", columnDefinition = "TEXT")
    private String srngMthdCn;


}