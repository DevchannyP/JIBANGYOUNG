package com.jibangyoung.domain.admin.repository;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.admin.dto.AdReportDto;
import com.jibangyoung.domain.auth.entity.QUser;
import com.jibangyoung.domain.auth.entity.UserStatus;
import com.jibangyoung.domain.community.entity.QPosts;
import com.jibangyoung.domain.mypage.entity.QComment;
import com.jibangyoung.domain.mypage.entity.QReport;
import com.jibangyoung.domain.mypage.entity.ReportTargetType;
import com.jibangyoung.domain.mypage.entity.ReviewResultCode;
import com.jibangyoung.domain.report.entity.QReportReason;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AdReportQueryRepository {

    private final JPAQueryFactory queryFactory;

    public List<AdReportDto> findRequestedReports(ReportTargetType type) {
        QReport r = QReport.report;
        QUser u = QUser.user;              // 신고자
        QUser ur = new QUser("ur");        // 담당자(처리자)
        QUser targetUser = new QUser("targetUser"); // 신고대상 유저
        QPosts p = QPosts.posts;
        QComment c = QComment.comment;
        QPosts p2 = new QPosts("p2");
        QReportReason rr = QReportReason.reportReason;

        var reviewStatusList = Arrays.asList(ReviewResultCode.REQUESTED, ReviewResultCode.APPROVED);
        var whereBuilder = r.reviewResultCode.in(reviewStatusList);
        if (type != null) {
            whereBuilder = whereBuilder.and(r.targetType.eq(type));
        }

        List<Tuple> tuples = queryFactory
                .select(
                        r.id,
                        r.user.id,
                        u.nickname,
                        r.targetType,
                        r.targetId,
                        // CASE문으로 게시글, 댓글, 유저 모두 대응
                        new CaseBuilder()
                                .when(r.targetType.eq(ReportTargetType.POST)).then(p.title)
                                .when(r.targetType.eq(ReportTargetType.COMMENT)).then(c.content)
                                .when(r.targetType.eq(ReportTargetType.USER)).then(targetUser.nickname)
                                .otherwise((String) null),
                        r.reasonCode,
                        rr.description,
                        r.reasonDetail,
                        r.createdAt,
                        r.reviewResultCode,
                        r.reviewedAt,
                        ur.nickname,
                        // regionId: 정책에 따라 필요시 추가 분기
                        new CaseBuilder()
                                .when(r.targetType.eq(ReportTargetType.POST)).then(p.regionId)
                                .when(r.targetType.eq(ReportTargetType.COMMENT)).then(p2.regionId)
                                .otherwise((Long) null),
                        // URL: 게시글, 댓글용
                        new CaseBuilder()
                                .when(r.targetType.eq(ReportTargetType.POST)).then(
                                        Expressions.stringTemplate("CONCAT('/community/', {0}, '/', {1})", p.regionId, p.id)
                                )
                                .when(r.targetType.eq(ReportTargetType.COMMENT)).then(
                                        Expressions.stringTemplate("CONCAT('/community/', {0}, '/', {1})", p2.regionId, p2.id)
                                )
                                .otherwise((String) null),
                        new CaseBuilder()
                                .when(r.targetType.eq(ReportTargetType.USER)).then(targetUser.status)
                                .otherwise((UserStatus) null)
                )
                .from(r)
                .leftJoin(u).on(r.user.id.eq(u.id))
                .leftJoin(ur).on(r.reviewedBy.eq(ur.id))
                .leftJoin(targetUser).on(
                    r.targetType.eq(ReportTargetType.USER)
                    .and(r.targetId.eq(targetUser.id))
                )
                .leftJoin(p).on(r.targetType.eq(ReportTargetType.POST).and(r.targetId.eq(p.id)))
                .leftJoin(c).on(r.targetType.eq(ReportTargetType.COMMENT).and(r.targetId.eq(c.id)))
                .leftJoin(p2).on(r.targetType.eq(ReportTargetType.COMMENT).and(c.targetPostId.eq(p2.id)))
                .leftJoin(rr).on(r.reasonCode.eq(rr.code))
                .where(whereBuilder)
                .orderBy(r.createdAt.desc())
                .fetch();

        // Tuple → DTO 매핑
        return tuples.stream().map(t -> {

        UserStatus userStatus = t.get(15, UserStatus.class); 
        String targetUserStatus = userStatus != null ? userStatus.name() : null;

        return AdReportDto.builder()
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
                .targetUserStatus(targetUserStatus)
                .build();
        }).collect(Collectors.toList());

    }
}
