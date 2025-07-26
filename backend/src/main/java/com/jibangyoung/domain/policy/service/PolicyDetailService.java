package com.jibangyoung.domain.policy.service;

import com.jibangyoung.domain.policy.dto.PolicyDetailDto;
import com.jibangyoung.domain.policy.entity.Policy;
import com.jibangyoung.domain.policy.entity.Region;
import com.jibangyoung.domain.policy.repository.PolicyRepository;
import com.jibangyoung.domain.policy.repository.RegionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PolicyDetailService {

    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private RegionRepository regionRepository;
    
    /**
     * 정책 상세 정보 조회
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
     * @param policy Policy 엔티티
     * @return PolicyDetailDto
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
     * @param aply_ymd 신청기간 문자열
     * @return 마감일 문자열
     */
    private String calculateDeadline(String aply_ymd) {
        if (aply_ymd == null || aply_ymd.isEmpty()) {
            return "기간 미정";
        }
        
        try {
            if (aply_ymd.contains("~")) {
                String[] periods = aply_ymd.split("~");
                if (periods.length >= 2) {
                    return periods[1].trim();
                }
            }
            return aply_ymd;
        } catch (Exception e) {
            return aply_ymd;
        }
    }
    
    /**
     * 마감일까지 남은 일수 계산
     * @param aply_ymd 신청기간 문자열
     * @return D-Day 문자열
     */
    private String calculateDDay(String aply_ymd) {
        if (aply_ymd == null || aply_ymd.isEmpty()) {
            return "";
        }
        
        try {
            String deadline = calculateDeadline(aply_ymd);
            
            if (deadline.contains("상시") || deadline.contains("연중") || deadline.contains("수시")) {
                return "상시모집";
            }
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            if (deadline.length() >= 10) {
                LocalDate deadlineDate = LocalDate.parse(deadline.substring(0, 10), formatter);
                LocalDate today = LocalDate.now();
                long daysUntil = ChronoUnit.DAYS.between(today, deadlineDate);
                
                if (daysUntil < 0) {
                    return "마감";
                } else if (daysUntil == 0) {
                    return "D-Day";
                } else {
                    return "D-" + daysUntil;
                }
            }
            
            return "";
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * 우편번호를 바탕으로 시도명 조회
     * @param zipCd 우편번호
     * @return 시도명
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
                    Region::getSido
                ));
            
            Integer zipCodeInt = Integer.valueOf(zipCd.trim());
            return regionMap.getOrDefault(zipCodeInt, "전국");
            
        } catch (NumberFormatException e) {
            return "전국";
        }
    }
}