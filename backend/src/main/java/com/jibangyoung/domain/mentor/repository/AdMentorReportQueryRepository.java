package com.jibangyoung.domain.mentor.repository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.auth.entity.QUser;
import com.jibangyoung.domain.community.entity.QPosts;
import com.jibangyoung.domain.mentor.dto.AdMentorReportDTO;
import com.jibangyoung.domain.mypage.entity.QComment;
import com.jibangyoung.domain.mypage.entity.QReport;
import com.jibangyoung.domain.mypage.entity.ReportTargetType;
import com.jibangyoung.domain.report.entity.QReportReason;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AdMentorReportQueryRepository {

    private final JPAQueryFactory queryFactory;

    public List<AdMentorReportDTO> findReportsByMentorRegionsAndType(List<String> regionPrefixes, ReportTargetType type) {
        QReport r = QReport.report;
        QUser u = QUser.user;
        QUser ur = new QUser("ur");
        QPosts p = QPosts.posts;
        QComment c = QComment.comment;
        QPosts p2 = new QPosts("p2");
        QReportReason rr = QReportReason.reportReason;

        // prefix 조건 or 조합
        // regionPrefixes = ["11", "12"] 이런 식
        var postRegionExpr = p.regionId.stringValue().substring(0, 2);
        var commentRegionExpr = p2.regionId.stringValue().substring(0, 2);

        var whereBuilder = r.targetType.eq(type)
                .andAnyOf(
                        r.targetType.eq(ReportTargetType.POST)
                                .and(postRegionExpr.in(regionPrefixes)),
                        r.targetType.eq(ReportTargetType.COMMENT)
                                .and(commentRegionExpr.in(regionPrefixes))
                );

        List<Tuple> tuples = queryFactory
                .select(
                        r.id,
                        r.user.id,
                        u.nickname,
                        r.targetType,
                        r.targetId,
                        // CASE WHEN
                        new CaseBuilder()
                                .when(r.targetType.eq(ReportTargetType.POST)).then(p.title)
                                .when(r.targetType.eq(ReportTargetType.COMMENT)).then(c.content)
                                .otherwise((String) null),
                        r.reasonCode,
                        rr.description,
                        r.reasonDetail,
                        r.createdAt,
                        r.reviewResultCode,
                        r.reviewedAt,
                        ur.nickname,
                        // regionId CASE
                        new CaseBuilder()
                                .when(r.targetType.eq(ReportTargetType.POST)).then(p.regionId)
                                .when(r.targetType.eq(ReportTargetType.COMMENT)).then(p2.regionId)
                                .otherwise((Long) null),
                        // url CASE
                        new CaseBuilder()
                                .when(r.targetType.eq(ReportTargetType.POST)).then(
                                        Expressions.stringTemplate("CONCAT('/community/', {0}, '/', {1})", p.regionId, p.id)
                                )
                                .when(r.targetType.eq(ReportTargetType.COMMENT)).then(
                                        Expressions.stringTemplate("CONCAT('/community/', {0}, '/', {1})", p2.regionId, p2.id)
                                )
                                .otherwise((String) null)
                )
                .from(r)
                .leftJoin(u).on(r.user.id.eq(u.id))
                .leftJoin(ur).on(r.reviewedBy.eq(ur.id))
                .leftJoin(p).on(r.targetType.eq(ReportTargetType.POST).and(r.targetId.eq(p.id)))
                .leftJoin(c).on(r.targetType.eq(ReportTargetType.COMMENT).and(r.targetId.eq(c.id)))
                .leftJoin(p2).on(r.targetType.eq(ReportTargetType.COMMENT).and(c.targetPostId.eq(p2.id)))
                .leftJoin(rr).on(r.reasonCode.eq(rr.code))
                .where(whereBuilder)
                .orderBy(r.createdAt.desc())
                .fetch();

        // Tuple → DTO 매핑
        return tuples.stream().map(t -> AdMentorReportDTO.builder()
                .id(t.get(r.id))
                .userId(t.get(r.user.id))
                .reporterName(t.get(u.nickname))
                .targetType(t.get(r.targetType))
                .targetId(t.get(r.targetId))
                .targetTitle(t.get(5, String.class))
                .reasonCode(t.get(r.reasonCode))
                .reasonDescription(t.get(rr.description))
                .reasonDetail(t.get(r.reasonDetail))
                .createdAt(t.get(r.createdAt))
                .reviewResultCode(t.get(r.reviewResultCode))
                .reviewedAt(t.get(r.reviewedAt))
                .reviewerName(t.get(ur.nickname))
                .regionId(t.get(13, Long.class))
                .url(t.get(14, String.class))
                .build()
        ).collect(Collectors.toList());
    }
}
