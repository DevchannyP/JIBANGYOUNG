package com.jibangyoung.domain.mentor.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.auth.entity.QUser;
import com.jibangyoung.domain.auth.entity.UserRole;
import com.jibangyoung.domain.community.entity.Posts;
import com.jibangyoung.domain.community.entity.Posts.PostCategory;
import com.jibangyoung.domain.community.entity.QPosts;
import com.jibangyoung.domain.mentor.dto.AdMentorLogListDTO;
import com.jibangyoung.domain.mentor.entity.QMentorTest;
import com.jibangyoung.domain.mypage.entity.QComment;
import com.jibangyoung.domain.mypage.entity.QReport;
import com.jibangyoung.domain.mypage.entity.ReviewResultCode;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AdMentorLogListQueryRepository {

    private final JPAQueryFactory queryFactory;
    // ADMIN
    public List<AdMentorLogListDTO> findMentorLogListAllRegions() {
        QMentorTest m = QMentorTest.mentorTest;
        QUser u = QUser.user;
        QPosts p = QPosts.posts;
        QComment c = QComment.comment;
        QReport r = QReport.report;

        List<Tuple> mentors = queryFactory
                .select(
                        m.userId,
                        u.nickname,
                        u.role,
                        m.regionId
                )
                .from(m)
                .join(u).on(m.userId.eq(u.id))
                .fetch();

        List<Long> userIds = mentors.stream()
                .map(row -> row.get(m.userId))
                .collect(Collectors.toList());

        if (userIds.isEmpty()) {
            return List.of();
        }

        Map<Long, Long> postCountMap = queryFactory
                .select(p.userId, p.count())
                .from(p)
                .where(p.userId.in(userIds))
                .groupBy(p.userId)
                .fetch()
                .stream().collect(Collectors.toMap(
                        tuple -> tuple.get(p.userId),
                        tuple -> tuple.get(p.count())
                ));

        Map<Long, Long> noticeCountMap = queryFactory
                .select(p.userId, p.count())
                .from(p)
                .where(
                        p.userId.in(userIds),
                        p.category.eq(Posts.PostCategory.NOTICE)
                )
                .groupBy(p.userId)
                .fetch()
                .stream().collect(Collectors.toMap(
                        tuple -> tuple.get(p.userId),
                        tuple -> tuple.get(p.count())
                ));

        Map<Long, Long> commentCountMap = queryFactory
                .select(c.user.id, c.count())
                .from(c)
                .where(c.user.id.in(userIds))
                .groupBy(c.user.id)
                .fetch()
                .stream().collect(Collectors.toMap(
                        tuple -> tuple.get(c.user.id),
                        tuple -> tuple.get(c.count())
                ));

        Map<String, Map<Long, Long>> reportStatusCountMap = new HashMap<>();
        List<String> statusList = List.of("APPROVED", "IGNORED", "INVALID", "PENDING", "REJECTED", "REQUESTED");
        for (String status : statusList) {
            Map<Long, Long> map = queryFactory
                    .select(r.reviewedBy, r.count())
                    .from(r)
                    .where(
                            r.reviewedBy.in(userIds),
                            r.reviewResultCode.eq(ReviewResultCode.valueOf(status))
                    )
                    .groupBy(r.reviewedBy)
                    .fetch()
                    .stream().collect(Collectors.toMap(
                            tuple -> tuple.get(r.reviewedBy),
                            tuple -> tuple.get(r.count())
                    ));
            reportStatusCountMap.put(status, map);
        }

        List<AdMentorLogListDTO> result = new ArrayList<>();
        for (Tuple row : mentors) {
            Long userId = row.get(m.userId);
            String nickname = row.get(u.nickname);

            UserRole userRole = row.get(u.role) != null ? (UserRole) row.get(u.role) : null;
            String role = userRole != null ? userRole.name() : null;
            String roleDescription = userRole != null ? userRole.getDescription() : null;

            Long regionId = row.get(m.regionId);

            result.add(
                    AdMentorLogListDTO.builder()
                            .userId(userId)
                            .nickname(nickname)
                            .role(role)
                            .roleDescription(roleDescription)
                            .regionId(regionId)
                            .postCount(postCountMap.getOrDefault(userId, 0L).intValue())
                            .noticeCount(noticeCountMap.getOrDefault(userId, 0L).intValue())
                            .commentCount(commentCountMap.getOrDefault(userId, 0L).intValue())
                            .approvedCount(reportStatusCountMap.get("APPROVED").getOrDefault(userId, 0L).intValue())
                            .ignoredCount(reportStatusCountMap.get("IGNORED").getOrDefault(userId, 0L).intValue())
                            .invalidCount(reportStatusCountMap.get("INVALID").getOrDefault(userId, 0L).intValue())
                            .pendingCount(reportStatusCountMap.get("PENDING").getOrDefault(userId, 0L).intValue())
                            .rejectedCount(reportStatusCountMap.get("REJECTED").getOrDefault(userId, 0L).intValue())
                            .requestedCount(reportStatusCountMap.get("REQUESTED").getOrDefault(userId, 0L).intValue())
                            .build()
            );
        }
        return result;
    }

    // Mentor
    public List<AdMentorLogListDTO> findMentorLogListByRegionIds(List<Long> regionIds) {
        QMentorTest m = QMentorTest.mentorTest;
        QUser u = QUser.user;
        QPosts p = QPosts.posts;
        QComment c = QComment.comment;
        QReport r = QReport.report;

        // 1. Mentor-User 조인(집계 대상 추출)
        List<Tuple> mentors = queryFactory
                .select(
                        m.userId,
                        u.nickname,
                        u.role,
                        m.regionId
                )
                .from(m)
                .join(u).on(m.userId.eq(u.id))
                .where(m.regionId.in(regionIds))
                .fetch();

        List<Long> userIds = mentors.stream()
                .map(row -> row.get(m.userId))
                .collect(Collectors.toList());

        // 2. postCount, noticeCount
        Map<Long, Long> postCountMap = queryFactory
                .select(p.userId, p.count())
                .from(p)
                .where(p.userId.in(userIds))
                .groupBy(p.userId)
                .fetch()
                .stream().collect(Collectors.toMap(
                        tuple -> tuple.get(p.userId),
                        tuple -> tuple.get(p.count())
                ));

        Map<Long, Long> noticeCountMap = queryFactory
                .select(p.userId, p.count())
                .from(p)
                .where(
                        p.userId.in(userIds),
                        p.category.eq(PostCategory.NOTICE)
                )
                .groupBy(p.userId)
                .fetch()
                .stream().collect(Collectors.toMap(
                        tuple -> tuple.get(p.userId),
                        tuple -> tuple.get(p.count())
                ));

        // 3. commentCount
        Map<Long, Long> commentCountMap = queryFactory
                .select(c.user.id, c.count())
                .from(c)
                .where(c.user.id.in(userIds))
                .groupBy(c.user.id)
                .fetch()
                .stream().collect(Collectors.toMap(
                        tuple -> tuple.get(c.user.id),
                        tuple -> tuple.get(c.count())
                ));

        // 4. Report status별 count (동일한 방식으로)
        Map<String, Map<Long, Long>> reportStatusCountMap = new HashMap<>();
        List<String> statusList = List.of("APPROVED", "IGNORED", "INVALID", "PENDING", "REJECTED", "REQUESTED");
        for (String status : statusList) {
            Map<Long, Long> map = queryFactory
                    .select(r.reviewedBy, r.count())
                    .from(r)
                    .where(
                        r.reviewedBy.in(userIds),
                        r.reviewResultCode.eq(ReviewResultCode.valueOf(status))
                    )
                    .groupBy(r.reviewedBy)
                    .fetch()
                    .stream().collect(Collectors.toMap(
                            tuple -> tuple.get(r.reviewedBy),
                            tuple -> tuple.get(r.count())
                    ));
            reportStatusCountMap.put(status, map);
        }

        // 5. DTO 조립 (for문)
        List<AdMentorLogListDTO> result = new ArrayList<>();
        for (Tuple row : mentors) {
            Long userId = row.get(m.userId);
            String nickname = row.get(u.nickname);

            // UserRole enum 타입 처리!
            UserRole userRole = row.get(u.role) != null ? (UserRole) row.get(u.role) : null;
            String role = userRole != null ? userRole.name() : null;
            String roleDescription = userRole != null ? userRole.getDescription() : null;

            Long regionId = row.get(m.regionId);

            result.add(
                    AdMentorLogListDTO.builder()
                            .userId(userId)
                            .nickname(nickname)
                            .role(role)
                            .roleDescription(roleDescription)  // 한글명 포함!
                            .regionId(regionId)
                            .postCount(postCountMap.getOrDefault(userId, 0L).intValue())
                            .noticeCount(noticeCountMap.getOrDefault(userId, 0L).intValue())
                            .commentCount(commentCountMap.getOrDefault(userId, 0L).intValue())
                            .approvedCount(reportStatusCountMap.get("APPROVED").getOrDefault(userId, 0L).intValue())
                            .ignoredCount(reportStatusCountMap.get("IGNORED").getOrDefault(userId, 0L).intValue())
                            .invalidCount(reportStatusCountMap.get("INVALID").getOrDefault(userId, 0L).intValue())
                            .pendingCount(reportStatusCountMap.get("PENDING").getOrDefault(userId, 0L).intValue())
                            .rejectedCount(reportStatusCountMap.get("REJECTED").getOrDefault(userId, 0L).intValue())
                            .requestedCount(reportStatusCountMap.get("REQUESTED").getOrDefault(userId, 0L).intValue())
                            .build()
            );
        }
        return result;
    }
}