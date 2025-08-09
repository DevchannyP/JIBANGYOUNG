package com.jibangyoung.domain.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.mentor.entity.MentorTest;

@Repository
public interface AdMentorProfileRepository  extends JpaRepository <MentorTest, Long> {
    // 200 ~ 400 점 사이 최고점 보유자
    @Query(value = """
        SELECT mp.user_id AS userId, MAX(mp.current_score) AS maxScore
        FROM mentor_profiles mp
        GROUP BY mp.user_id
        HAVING MAX(mp.current_score) >= 200
        """, nativeQuery = true)
    List<AdUserMaxScore> findUsersForPromotionToB();

    // 401 ~ 600 점 사이 최고점 보유자
    @Query(value = """
        SELECT mp.user_id AS userId, MAX(mp.current_score) AS maxScore
        FROM mentor_profiles mp
        GROUP BY mp.user_id
        HAVING MAX(mp.current_score) >= 401
        """, nativeQuery = true)
    List<AdUserMaxScore> findUsersForPromotionToA();
}