package com.jibangyoung.domain.policy.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "policies") // DB 테이블명
@Getter
@Setter
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer NO;

    @Column(name = "plcy_nm", nullable = false, length = 255)
    private String plcy_nm;

    @Column(name = "aply_prd_se_cd", length = 10)
    private String aply_prd_se_cd;

    @Column(name = "aply_ymd", length = 50)
    private String aply_ymd;

    @Column(name = "ptcp_prp_trgt_cn", columnDefinition = "TEXT")
    private String ptcp_prp_trgt_cn;

    @Column(name = "ref_url_addr1", length = 500)
    private String ref_url_addr1;

    @Column(name = "zip_cd", length = 10)
    private String zip_cd;

    @Column(name = "ref_url_addr2", length = 500)
    private String ref_url_addr2;

    @Column(name = "school_cd", length = 10)
    private String school_cd;

    @Column(name = "s_biz_cd", length = 10)
    private String s_biz_cd;

    @Column(name = "mclsf_nm", length = 50)
    private String mclsf_nm;

    @Column(name = "lclsf_nm", length = 50)
    private String lclsf_nm;

    @Column(name = "sprt_scl_cnt")
    private Integer sprt_scl_cnt;

    @Column(name = "plcy_aply_mthd_cn", columnDefinition = "TEXT")
    private String plcy_aply_mthd_cn;

    @Column(name = "plcy_kywd_nm", length = 100)
    private String plcy_kywd_nm;

    @Column(name = "add_aply_qlfc_cnd_cn", columnDefinition = "TEXT")
    private String add_aply_qlfc_cnd_cn;

    @Column(name = "sprt_trgt_max_age")
    private Integer sprt_trgt_max_age;

    @Column(name = "oper_inst_nm", length = 100)
    private String oper_inst_nm;

    @Column(name = "aply_url_addr", length = 500)
    private String aply_url_addr;

    @Column(name = "plcy_sprt_cn", columnDefinition = "TEXT")
    private String plcy_sprt_cn;

    @Column(name = "sprt_trgt_min_age")
    private Integer sprt_trgt_min_age;

    @Column(name = "mrg_stts_cd", length = 10)
    private String mrg_stts_cd;

    @Column(name = "etc_mttr_cn", columnDefinition = "TEXT")
    private String etc_mttr_cn;

    @Column(name = "plcy_no", length = 30)
    private String plcy_no;

    @Column(name = "sbmsn_dcmnt_cn", columnDefinition = "TEXT")
    private String sbmsn_dcmnt_cn;

    @Column(name = "srng_mthd_cn", columnDefinition = "TEXT")
    private String srng_mthd_cn;

    @Column(name = "job_cd", length = 20)
    private String job_cd;

    @Column(name = "favorites", nullable = false)
    private int favorites; // 총 추천 개수
}
