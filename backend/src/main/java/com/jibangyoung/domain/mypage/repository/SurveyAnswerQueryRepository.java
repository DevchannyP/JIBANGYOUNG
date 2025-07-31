// repository/SurveyAnswerQueryRepository.java
package com.jibangyoung.domain.mypage.repository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.mypage.dto.SurveyResponseGroupDto;
import com.jibangyoung.domain.mypage.entity.QMyPageSurveyAnswer; // ← 변경!
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SurveyAnswerQueryRepository {
    private final JPAQueryFactory queryFactory;

    /**
     * responseId별 그룹화+페이징, answerCount/제출일 projection
     */
    public List<SurveyResponseGroupDto> findGroupsByUserId(Long userId, int page, int size) {
        QMyPageSurveyAnswer q = QMyPageSurveyAnswer.myPageSurveyAnswer; // ← 변경!

        // (1) 그룹핑 + 페이징 (응답 묶음 responseId만 추출)
        List<Long> responseIds = queryFactory
                .select(q.responseId)
                .from(q)
                .where(q.userId.eq(userId))
                .groupBy(q.responseId)
                .orderBy(q.submittedAt.desc())
                .offset((long) (page - 1) * size)
                .limit(size)
                .fetch();

        // (2) 각 그룹의 메타 정보(DTO) 추출
        return responseIds.stream().map(responseId -> {
            // answerCount, 대표 submittedAt 추출
            long count = queryFactory.select(q.count())
                    .from(q)
                    .where(q.responseId.eq(responseId))
                    .fetchOne();
            // 대표 submittedAt (최신)
            var submittedAt = queryFactory.select(q.submittedAt)
                    .from(q)
                    .where(q.responseId.eq(responseId))
                    .orderBy(q.submittedAt.desc())
                    .fetchFirst();
            // 대표 userId
            var anyUserId = queryFactory.select(q.userId)
                    .from(q)
                    .where(q.responseId.eq(responseId))
                    .fetchFirst();
            return SurveyResponseGroupDto.builder()
                    .responseId(responseId)
                    .userId(anyUserId)
                    .answerCount((int) count)
                    .submittedAt(submittedAt)
                    .build();
        }).collect(Collectors.toList());
    }

    public long countGroupsByUserId(Long userId) {
        QMyPageSurveyAnswer q = QMyPageSurveyAnswer.myPageSurveyAnswer; // ← 변경!
        return queryFactory
                .select(q.responseId.countDistinct())
                .from(q)
                .where(q.userId.eq(userId))
                .fetchOne();
    }
}
