package com.jibangyoung.domain.mentor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.mentor.entity.MentorCertificationRequests;

@Repository
public interface MentorCertificationRequestsRepository extends JpaRepository<MentorCertificationRequests, Long> {
    
    // 사용자별 멘토 신청 상태 조회
    Optional<MentorCertificationRequests> findByUserId(Long userId);
    
    // 사용자가 이미 신청했는지 확인
    boolean existsByUserId(Long userId);

    @Query("""
        SELECT r
        FROM MentorCertificationRequests r
        WHERE r.regionId IN :regionIds
    """)
    List<MentorCertificationRequests> findByRegionIds(@Param("regionIds") List<Long> regionIds);
}