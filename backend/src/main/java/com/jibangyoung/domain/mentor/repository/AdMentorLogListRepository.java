package com.jibangyoung.domain.mentor.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.mentor.dto.AdMentorLogListDTO;

public interface AdMentorLogListRepository extends JpaRepository<User, Long> {

@Query("""
    SELECT new com.jibangyoung.domain.mentor.dto.AdMentorLogListDTO(
        u.id,
        u.nickname,
        u.role,
        m.regionId,
        (SELECT COUNT(p) FROM Posts p WHERE p.userId = u.id),
        (SELECT COUNT(c) FROM Comment c WHERE c.user.id = u.id),
        (SELECT COUNT(r) FROM Report r WHERE r.reviewedBy = u.id AND r.reviewResultCode = com.jibangyoung.domain.report.entity.ReportStatus.APPROVED)
    )
    FROM MentorTest m
    JOIN User u ON m.userId = u.id
    WHERE m.regionId IN :regionIds
""")
List<AdMentorLogListDTO> findMentorLogListByRegionIds(@Param("regionIds") List<Long> regionIds);

}
