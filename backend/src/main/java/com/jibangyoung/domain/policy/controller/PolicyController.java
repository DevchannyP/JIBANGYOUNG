package com.jibangyoung.domain.policy.controller;

import com.jibangyoung.domain.policy.dto.PolicyResponseDto;
import com.jibangyoung.domain.policy.service.PolicyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {
    
    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping
    public List<PolicyResponseDto> getAllPolicies() {
        return policyService.getNoPlcyNm();
    }
}