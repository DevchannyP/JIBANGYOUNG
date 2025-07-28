package com.jibangyoung.domain.mypage.support;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.mypage.dto.MyReportDto;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

/**
 * 신고 이력 조회 전용 쿼리 리포지토리
 * - Projection + DB Index 최적화
 * - 추가 필터/페이징 쉽게 확장
 */
@Repository
public class ReportQueryRepository {
    @PersistenceContext
    private EntityManager em;

    public List<MyReportDto> findMyReportsByUserId(Long userId) {
        return em
                .createQuery(
                        """
                                    SELECT new com.jibangyoung.domain.mypage.dto.MyReportDto(
                                        r.id, r.user.id, r.targetType, r.targetId, r.reasonCode, r.reasonDetail, r.createdAt, r.reviewResultCode
                                    )
                                    FROM Report r
                                    WHERE r.user.id = :userId
                                    ORDER BY r.createdAt DESC
                                """,
                        MyReportDto.class)
                .setParameter("userId", userId)
                .getResultList();
    }
}
