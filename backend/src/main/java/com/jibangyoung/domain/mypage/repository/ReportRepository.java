// com.jibangyoung.domain.mypage.repository.ReportRepository.java
package com.jibangyoung.domain.mypage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.mypage.entity.Report;
import com.jibangyoung.domain.mypage.entity.ReportTargetType;

public interface ReportRepository extends JpaRepository<Report, Long> {
    // userId로 내림차순 전체 조회
    List<Report> findByUser_IdOrderByCreatedAtDesc(Long userId);
    
    // 중복 신고 방지를 위한 체크
    boolean existsByUserIdAndTargetTypeAndTargetId(Long userId, ReportTargetType targetType, Long targetId);

    // (Optional) 페이징 지원
    // Page<Report> findByUser_Id(Long userId, Pageable pageable);
}
