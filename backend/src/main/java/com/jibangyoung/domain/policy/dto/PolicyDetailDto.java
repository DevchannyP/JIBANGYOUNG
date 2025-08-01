package com.jibangyoung.domain.policy.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyDetailDto {

    @JsonProperty("NO")
    private Integer NO; // 고유 번호

    private String plcy_nm; // 정책명

    private LocalDate deadline; // 마감기한

    private Long dDay; // 마감까지 남은 일수

    private String sidoName; // 시도명

    private String ptcp_prp_trgt_cn; // 참여 내용

    private String ref_url_addr1; // 참고 URL1

    private String ref_url_addr2; // 참고 URL2

    private String mclsf_nm; // 정책중분류명

    private String lclsf_nm; // 정책대분류명

    private Integer sprt_scl_cnt; // 지원최대수

    private String plcy_aply_mthd_cn; // 지원 내용

    private String add_aply_qlfc_cnd_cn; // 지원 내용

    private Integer sprt_trgt_max_age; // 대상 최대 연령

    private String oper_inst_nm; // 운영기관명

    private String aply_url_addr; // 신청 URL 주소

    private String plcy_sprt_cn; // 지원 내용

    private Integer sprt_trgt_min_age; // 대상 최소 연령

    private String etc_mttr_cn; // 기타 내용

    private String sbmsn_dcmnt_cn; // 추가 내용

    private String srng_mthd_cn; // 심사 내용
}