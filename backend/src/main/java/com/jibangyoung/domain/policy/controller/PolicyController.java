package com.jibangyoung.domain.policy.controller;

import com.jibangyoung.domain.policy.dto.PolicyResponseDto;
import com.jibangyoung.domain.policy.service.PolicyService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/policyApi")
public class PolicyController {
    
    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }
    
    @GetMapping
    public List<PolicyResponseDto> getAllPolicies() {
        System.out.println("=== API 호출됨 ===");
    try {
        List<PolicyResponseDto> result = policyService.getNoPlcyNm();
        System.out.println("조회된 데이터 개수: " + result.size());
        return result;
    } catch (Exception e) {
        System.err.println("오류 발생: " + e.getMessage());
        e.printStackTrace();
        throw e;
    }
}
}