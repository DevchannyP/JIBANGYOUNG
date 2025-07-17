package com.jibangyoung.domain.policy.service;

import com.jibangyoung.domain.policy.dto.PolicyResponseDto;
import com.jibangyoung.domain.policy.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolicyService {
    private final PolicyRepository policyRepository;

    public PolicyService(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    public List<PolicyResponseDto> getNoPlcyNm() {
    System.out.println("=== Service 호출됨 ===");
    try {
        List<Object[]> results = policyRepository.findNoPlcyNm();
        System.out.println("DB 조회 결과 개수: " + results.size());
        
        List<PolicyResponseDto> dtos = results.stream()
            .map(result -> new PolicyResponseDto((Integer) result[0], (String) result[1]))
            .collect(Collectors.toList());
        
        System.out.println("DTO 변환 완료");
        return dtos;
    } catch (Exception e) {
        System.err.println("Service 오류: " + e.getMessage());
        e.printStackTrace();
        throw e;
    }
}
}