// package com.jibangyoung.domain.policy;

// import com.jibangyoung.domain.policy.dto.PolicyCardDto;
// import com.jibangyoung.domain.policy.dto.PolicyDetailDto;
// import com.jibangyoung.domain.policy.entity.Policy;
// import com.jibangyoung.domain.policy.repository.PolicyRepository;
// import com.jibangyoung.domain.policy.service.PolicyDetailService;
// import com.jibangyoung.domain.policy.service.PolicyService;
// import jakarta.annotation.PostConstruct;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Component;

// import java.util.List;

// @Component
// public class SimplePolicyTest {

// @Autowired
// private PolicyService policyService;

// @Autowired
// private PolicyRepository policyRepository;

// @Autowired
// private PolicyDetailService policyDetailService;

// @PostConstruct
// public void testPolicies() {
// System.out.println("\n=== Repository에서 직접 조회 ===");
// testRepositoryDirectQuery();

// System.out.println("\n=== Service에서 조회 테스트 ===");
// testPolicyCardService();

// System.out.println("\n=== Policy Detail 테스트 ===");
// testPolicyDetailService();
// }

// private void testRepositoryDirectQuery() {
// List<Policy> repoPolicies = policyRepository.findDistinctByPlcyNm().stream()
// .limit(10)
// .toList();
// for (Policy policy : repoPolicies) {
// System.out.println("NO: " + policy.getNO() +
// ", plcyNm: " + policy.getPlcy_nm() +
// ", aplyYmd: " + policy.getAply_ymd() +
// ", zipCd: " + policy.getZip_cd());
// }
// }

// private void testPolicyCardService() {
// List<PolicyCardDto> servicePolicies = policyService.getActivePolicyCards();
// servicePolicies.stream()
// .limit(10)
// .forEach(policy -> {
// System.out.println("NO: " + policy.getNO() +
// ", plcyNm: " + policy.getPlcy_nm() +
// ", deadline: " + policy.getDeadline() +
// ", dDay: " + policy.getD_day() +
// ", sidoName: " + policy.getSidoName());
// });
// }

// private void testPolicyDetailService() {
// // 상위 10개 정책의 NO를 가져와서 상세 정보 조회
// List<Policy> testPolicies = policyRepository.findDistinctByPlcyNm().stream()
// .limit(10)
// .toList();

// for (Policy policy : testPolicies) {
// try {
// List<PolicyDetailDto> detailList =
// policyDetailService.getPolicyDetail(policy.getNO());
// if (!detailList.isEmpty()) {
// PolicyDetailDto detail = detailList.get(0);
// System.out.println("=== 정책 상세 정보 (NO: " + detail.getNO() + ") ===");
// System.out.println("정책명: " + detail.getPlcy_nm());
// System.out.println("마감일: " + detail.getDeadline());
// System.out.println("D-Day: " + detail.getDDay());
// System.out.println("지역: " + detail.getSidoName());
// System.out.println("운영기관: " + detail.getOper_inst_nm());
// System.out.println("대분류: " + detail.getLclsf_nm());
// System.out.println("중분류: " + detail.getMclsf_nm());
// System.out.println("최소연령: " + detail.getSprt_trgt_min_age());
// System.out.println("최대연령: " + detail.getSprt_trgt_max_age());
// System.out.println("신청URL: " + detail.getAply_url_addr());
// System.out.println("참고URL1: " + detail.getRef_url_addr1());
// System.out.println("참고URL2: " + detail.getRef_url_addr2());
// System.out.println("지원내용: " + (detail.getPlcy_sprt_cn() != null ?
// detail.getPlcy_sprt_cn().substring(0, Math.min(50,
// detail.getPlcy_sprt_cn().length())) + "..." : "없음"));
// System.out.println("========================================\n");
// }
// } catch (Exception e) {
// System.out.println("정책 NO " + policy.getNO() + " 조회 실패: " + e.getMessage());
// }
// }
// }
// }