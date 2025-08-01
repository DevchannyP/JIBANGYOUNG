package com.jibangyoung.domain.policy.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.policy.dto.PolicyDetailDto;
import com.jibangyoung.domain.policy.entity.Policy;
import com.jibangyoung.domain.policy.entity.Region;
import com.jibangyoung.domain.policy.repository.PolicyRepository;
import com.jibangyoung.domain.policy.repository.RegionRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PolicyDetailService {

    private final PolicyRepository policyRepository;
    private final RegionRepository regionRepository;

    /**
     * 정책 상세 정보 조회
     * 
     * @param NO 정책 고유번호
     * @return PolicyDetailDto 리스트 (단일 항목)
     */
    public List<PolicyDetailDto> getPolicyDetail(Integer NO) {
        Policy policy = policyRepository.findById(NO)
                .orElseThrow(() -> new RuntimeException("정책을 찾을 수 없습니다. NO: " + NO));

        PolicyDetailDto dto = convertToDetailDto(policy);
        return Arrays.asList(dto);
    }

    /**
     * Policy Entity를 PolicyDetailDto로 변환
     */
    private PolicyDetailDto convertToDetailDto(Policy policy) {
        return PolicyDetailDto.builder()
                .NO(policy.getNO())
                .plcy_nm(policy.getPlcy_nm())
                .deadline(calculateDeadline(policy.getAply_ymd()))
                .dDay(calculateDDay(policy.getAply_ymd()))
                .sidoName(getSidoNameByZipCode(policy.getZip_cd()))
                .ptcp_prp_trgt_cn(policy.getPtcp_prp_trgt_cn())
                .ref_url_addr1(policy.getRef_url_addr1())
                .ref_url_addr2(policy.getRef_url_addr2())
                .mclsf_nm(policy.getMclsf_nm())
                .lclsf_nm(policy.getLclsf_nm())
                .sprt_scl_cnt(policy.getSprt_scl_cnt())
                .plcy_aply_mthd_cn(policy.getPlcy_aply_mthd_cn())
                .add_aply_qlfc_cnd_cn(policy.getAdd_aply_qlfc_cnd_cn())
                .sprt_trgt_max_age(policy.getSprt_trgt_max_age())
                .oper_inst_nm(policy.getOper_inst_nm())
                .aply_url_addr(policy.getAply_url_addr())
                .plcy_sprt_cn(policy.getPlcy_sprt_cn())
                .sprt_trgt_min_age(policy.getSprt_trgt_min_age())
                .etc_mttr_cn(policy.getEtc_mttr_cn())
                .sbmsn_dcmnt_cn(policy.getSbmsn_dcmnt_cn())
                .srng_mthd_cn(policy.getSrng_mthd_cn())
                .build();
    }

    /**
     * 신청기간(aply_ymd)을 바탕으로 마감일 계산
     */
    private LocalDate calculateDeadline(String aply_ymd) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            if (aply_ymd == null || aply_ymd.length() < 8) {
                return LocalDate.parse("2099-12-31", formatter); // 기본 상시 마감일
            }

            // 끝에서 8자리 추출 (YYYYMMDD)
            String endDateRaw = aply_ymd.substring(aply_ymd.length() - 8);

            if (endDateRaw == null) {
                return LocalDate.parse("2099-12-31", formatter); // 기본 상시 마감일
            }

            // yyyy-MM-dd 형태로 변환
            String formattedDate = endDateRaw.substring(0, 4) + "-" +
                    endDateRaw.substring(4, 6) + "-" +
                    endDateRaw.substring(6, 8);

            return LocalDate.parse(formattedDate, formatter);
        } catch (Exception e) {
            return LocalDate.parse("2099-12-31", formatter); // 파싱 실패 시 기본 마감일
        }
    }

    /**
     * 마감일까지 남은 일수 계산
     * 
     * @param aply_ymd 신청기간 문자열
     * @return D-Day 문자열
     */
    private Long calculateDDay(String aply_ymd) {
        if (aply_ymd == null || aply_ymd.isEmpty()) {
            return 999L;
        }

        try {
            LocalDate deadline = calculateDeadline(aply_ymd);

            LocalDate today = LocalDate.now();
            long daysUntil = ChronoUnit.DAYS.between(today, deadline);
            return daysUntil;
        } catch (Exception e) {
            return 0L;
        }
    }

    /**
     * 지역코드를 바탕으로 시도명 조회
     * 
     */
    private String getSidoNameByZipCode(String zipCd) {
        if (zipCd == null || zipCd.isEmpty()) {
            return "전국";
        }

        try {
            // region 테이블에서 매핑 정보 조회
            Map<Integer, String> regionMap = regionRepository.findAll().stream()
                    .collect(Collectors.toMap(
                            Region::getRegionCode,
                            Region::getSido));

            Integer zipCodeInt = Integer.valueOf(zipCd.trim());
            return regionMap.get(zipCodeInt);

        } catch (NumberFormatException e) {
            return "전국";
        }
    }
}