package com.jibangyoung.domain.mentor.repository;

import com.jibangyoung.domain.mentor.entity.MentorCertificationRequests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentorCertificationRequestsRepository extends JpaRepository<MentorCertificationRequests, Long> {
    
    // 사용자별 멘토 신청 상태 조회
    Optional<MentorCertificationRequests> findByUserId(Long userId);
    
    // 사용자가 이미 신청했는지 확인
    boolean existsByUserId(Long userId);
}