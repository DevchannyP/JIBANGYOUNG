package com.jibangyoung.domain.policy;

import com.jibangyoung.domain.policy.dto.PolicyResponseDto;
import com.jibangyoung.domain.policy.entity.PolicyView;
import com.jibangyoung.domain.policy.service.PolicyService;
import com.jibangyoung.domain.policy.repository.PolicyRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SimplePolicyTest {
    private final PolicyService policyService;

    @Autowired
    public SimplePolicyTest(PolicyService policyService, PolicyRepository policyRepository) {
        this.policyService = policyService;
    }

    @PostConstruct
    public void testTop10Policies() {
        // PolicyResponseDto 테스트
        System.out.println("Testing PolicyResponseDto:");
        List<PolicyResponseDto> policies = policyService.getNoPlcyNm();
        for (PolicyResponseDto policy : policies) {
            System.out.println("NO: " + policy.getNo() + ", plcyNm: " + policy.getPlcyNm());
        }
    }
}