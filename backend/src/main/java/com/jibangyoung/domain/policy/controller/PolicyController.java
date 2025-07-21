package com.jibangyoung.domain.policy.controller;

import com.jibangyoung.domain.policy.dto.PolicyCardDto;
import com.jibangyoung.domain.policy.service.PolicyService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/policy")
public class PolicyController {
    
    @Autowired
    private PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    // 클라이언트에서 /api/policies/cards 요청 시 정책 카드 DTO 리스트 반환
    @GetMapping("/policy.c")
    public List<PolicyCardDto> getPolicyCards() {
        return policyService.getActivePolicyCards();
    }

    //Region 필터링 엔드포인트
    @GetMapping("/region.api")
    public List<PolicyCardDto> getPoliciesByRegion(@RequestParam(name= "region_code", required= false, defaultValue = "99999" ) int regionCode) {
        return policyService.getPoliciesByRegion(regionCode);
    }    

    
}