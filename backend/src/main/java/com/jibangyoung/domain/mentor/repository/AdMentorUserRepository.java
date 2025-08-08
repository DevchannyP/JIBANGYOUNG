package com.jibangyoung.domain.mentor.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.mentor.dto.AdMentorUserDTO;

public interface AdMentorUserRepository extends JpaRepository<User, Long> {

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

    // 로그인 유저 ID로 nickname 조회
    @Query("""
        SELECT u.nickname
        FROM User u
        WHERE u.id = :userId
    """)
    String findNicknameByUserId(@Param("userId") Long userId);
}