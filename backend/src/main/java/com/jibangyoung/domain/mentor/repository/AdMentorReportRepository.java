package com.jibangyoung.domain.mentor.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jibangyoung.domain.mentor.dto.AdMentorReportDTO;
import com.jibangyoung.domain.mypage.entity.Report;
import com.jibangyoung.domain.mypage.entity.ReportTargetType;

public interface AdMentorReportRepository extends JpaRepository<Report, Long> {

    @Query("""
        SELECT new com.jibangyoung.domain.mentor.dto.AdMentorReportDTO(
            r.id,
            r.user.id,
            u.nickname,
            r.targetType,
            r.targetId,
            CASE
                WHEN r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.POST
                    THEN p.title
                WHEN r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.COMMENT
                    THEN c.content
                ELSE null
            END,
            r.reasonCode,
            rr.description,      
            r.reasonDetail,
            r.createdAt,
            r.reviewResultCode,
            r.reviewedAt,
            ur.nickname,
            CASE
                WHEN r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.POST
                    THEN p.regionId
                WHEN r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.COMMENT
                    THEN p2.regionId
                ELSE null
            END,
            CASE
                WHEN r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.POST
                    THEN CONCAT('/community/', p.regionId, '/', p.id)
                WHEN r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.COMMENT
                    THEN CONCAT('/community/', p2.regionId, '/', p2.id)
                ELSE null
            END
        )
        FROM Report r
            LEFT JOIN User u ON r.user.id = u.id
            LEFT JOIN User ur ON r.reviewedBy = ur.id
            LEFT JOIN Posts p ON r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.POST AND r.targetId = p.id
            LEFT JOIN Comment c ON r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.COMMENT AND r.targetId = c.id
            LEFT JOIN Posts p2 ON r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.COMMENT AND c.targetPostId = p2.id
            LEFT JOIN ReportReason rr ON r.reasonCode = rr.code 
        WHERE (
            (r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.POST
                AND SUBSTRING(CAST(p.regionId AS string), 1, 2) IN (:regionIds))
            OR
            (r.targetType = com.jibangyoung.domain.mypage.entity.ReportTargetType.COMMENT
                AND SUBSTRING(CAST(p2.regionId AS string), 1, 2) IN (:regionIds))
        )
        AND r.targetType = :type
        ORDER BY r.createdAt DESC
    """)
    List<AdMentorReportDTO> findReportsByMentorRegionsAndType(
        @Param("regionIds") List<String> regionIds,
        @Param("type") ReportTargetType type
    );
}
