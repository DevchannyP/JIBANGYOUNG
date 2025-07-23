package com.jibangyoung.domain.policy;

import com.jibangyoung.domain.policy.dto.PolicyCardDto;
import com.jibangyoung.domain.policy.entity.Policy;
import com.jibangyoung.domain.policy.repository.PolicyRepository;
import com.jibangyoung.domain.policy.service.PolicyService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SimplePolicyTest {

    @Autowired
    private PolicyService policyService;

    @Autowired
    private PolicyRepository policyRepository;

    @PostConstruct
    public void testTop10Policies() {
        // Repository에서 직접 조회
        System.out.println("=== Repository에서 직접 조회 ===");
        List<Policy> repoPolicies = policyRepository.findDistinctByPlcyNm().stream()
                .limit(10)
                .toList();
        for (Policy policy : repoPolicies) {
            System.out.println("NO: " + policy.getNO() +
                    ", plcyNm: " + policy.getPlcy_nm() +
                    ", aplyYmd: " + policy.getAply_ymd());
        }
        //service에서 조회
         System.out.println("=== Service에서 조회 테스트 ===");
        List<PolicyCardDto> servicePolicies = policyService.getActivePolicyCards();
        for (PolicyCardDto policy : servicePolicies) {
            System.out.println("NO: " + policy.getNO() +
                    ", plcyNm: " + policy.getPlcy_nm() +
                    ", aplyYmd: " + policy.getDeadline() +
                    ", sidoName: " + policy.getSidoName());
        }
    }
}
