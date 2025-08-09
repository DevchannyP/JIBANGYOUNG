package com.jibangyoung.domain.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.mentor.dto.AdMentorRequestDTO;
import com.jibangyoung.domain.mentor.entity.MentorCertificationRequests;

@Repository
public interface AdMentorRequestRepository extends JpaRepository<MentorCertificationRequests, Long> {

    @Query("""
        SELECT new com.jibangyoung.domain.mentor.dto.AdMentorRequestDTO(
            r.id,
            r.userId,
            r.userName,
            ur.nickname,            
            r.userEmail,
            r.regionId,
            r.reason,
            r.governmentAgency,
            r.documentUrl,
            CAST(r.status AS string),
            r.createdAt,
            r.reviewedAt,
            r.reviewedBy,
            r.rejectionReason
        )
        FROM MentorCertificationRequests r
        LEFT JOIN User ur ON r.reviewedBy = ur.id
        ORDER BY r.createdAt DESC
    """)
    List<AdMentorRequestDTO> findAllAsDto();
}
