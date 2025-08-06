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
        JOIN User u ON m.user.id = u.id
        WHERE m.regionId IN :regionIds
    """)
    List<AdMentorUserDTO> findUsersByMentorRegionIds(@Param("regionIds") List<Long> regionIds);

    // regionId(지역코드)를 userId로 조회하는 쿼리
    @Query("""
        SELECT m.regionId
        FROM MentorTest m
        WHERE m.user.id = :userId
    """)
    List<Long> findRegionIdByUserId(@Param("userId") Long userId);
}