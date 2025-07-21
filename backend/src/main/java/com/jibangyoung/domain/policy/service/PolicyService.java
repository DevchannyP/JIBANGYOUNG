package com.jibangyoung.domain.policy.service;

import com.jibangyoung.domain.policy.dto.PolicyCardDto;
import com.jibangyoung.domain.policy.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // 생성자 주입 자동 생성
public class PolicyService {

    private final PolicyRepository policyRepository;

    // 마감일이 지나지 않은 정책 카드 DTO 리스트를 반환
    public List<PolicyCardDto> getActivePolicyCards() {
        LocalDate today = LocalDate.now(); // 오늘 날짜
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // 날짜 파싱 포맷

        return policyRepository.findDistinctByPlcyNm().stream() // 정책명 기준 중복 제거된 정책 조회
                .map(p -> {
                    // aplyYmd에서 마감일 추출
                    LocalDate deadline = extractDeadline(p.getAply_ymd(), formatter);
                    if (deadline == null) return null; // 마감일 파싱 실패 시 제외

                    // D-Day 계산 (마감일 - 오늘)
                    long d_day = java.time.temporal.ChronoUnit.DAYS.between(today, deadline);
                    if (d_day < 0) return null; // 마감일이 지난 경우 제외

                    // DTO 생성하여 반환
                    return new PolicyCardDto(
                            p.getNO(),           // 정책 번호
                            p.getPlcy_nm(),       // 정책명
                            p.getAply_ymd(),      // 신청 기간 원본 문자열
                            p.getPlcy_kywd_nm(),   // 정책 키워드
                            deadline,            // 변환된 마감일
                            d_day                 // 마감까지 남은 일수
                    );
                })
                .filter(dto -> dto != null) // null 제거 (마감일이 없거나 지난 정책 제외)
                .collect(Collectors.toList());
    }
//deadline 추출하는 방법
private LocalDate extractDeadline(String aply_ymd, DateTimeFormatter formatter) {
    try {
        if (aply_ymd == null || aply_ymd.length() < 8) {
            return LocalDate.parse("2099-12-31", formatter); // 기본 상시 마감일
        }

        // 끝에서 8자리 추출 (YYYYMMDD)
        String endDateRaw = aply_ymd.substring(aply_ymd.length() - 8);

        // "yyyy-MM-dd"로 포맷 변경
        String formattedDate = endDateRaw.substring(0, 4) + "-" +
                               endDateRaw.substring(4, 6) + "-" +
                               endDateRaw.substring(6, 8);
        System.out.println(formattedDate);
        return LocalDate.parse(formattedDate, formatter);
    } catch (Exception e) {
        return LocalDate.parse("2099-12-31", formatter); // 파싱 실패 시 상시 마감일
    }
}
}
