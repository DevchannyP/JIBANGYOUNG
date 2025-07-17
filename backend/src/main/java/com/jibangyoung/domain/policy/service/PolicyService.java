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
        List<Object[]> results = policyRepository.findNoPlcyNm();
        return results.stream()
            .map(result -> new PolicyResponseDto((Integer) result[0], (String) result[1]))
            .collect(Collectors.toList());
    }
}