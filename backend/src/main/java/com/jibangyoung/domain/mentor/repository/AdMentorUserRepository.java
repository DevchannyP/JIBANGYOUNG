package com.jibangyoung.domain.mentor.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.mentor.dto.AdMentorUserDTO;

public interface AdMentorUserRepository extends JpaRepository<User, Long> {
    // 내 지역 멘토목록_전체(admin)
    @Query("""
        SELECT new com.jibangyoung.domain.mentor.dto.AdMentorUserDTO(
            u.id,
            u.nickname,
            u.role,
            m.warningCount,
            m.regionId,
            m.currentScore
        )
        FROM MentorTest m
        JOIN User u ON m.userId = u.id
    """)
    List<AdMentorUserDTO> findAllMentorUsers();

    @Query("""
        SELECT new com.jibangyoung.domain.mentor.dto.AdMentorUserDTO(
            u.id,
            u.nickname,
            u.role,
            m.warningCount,
            m.regionId,
            m.currentScore
        )
        FROM MentorTest m
        JOIN User u ON m.userId = u.id
        WHERE m.regionId IN :regionIds
    """)
    List<AdMentorUserDTO> findUsersByMentorRegionIds(@Param("regionIds") List<Long> regionIds);

    // 로그인 유저 ID로 regionId(지역코드) 조회
    @Query("""
        SELECT m.regionId
        FROM MentorTest m
        WHERE m.userId = :userId
    """)
    List<Long> findRegionIdByUserId(@Param("userId") Long userId);
}