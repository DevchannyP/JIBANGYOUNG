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
        FROM com.jibangyoung.domain.mentor.entity.MentorTest m
        JOIN com.jibangyoung.domain.auth.entity.User u ON m.userId = u.id
        WHERE m.regionId IN (
            SELECT m2.regionId
            FROM com.jibangyoung.domain.mentor.entity.MentorTest m2
            WHERE m2.userId = :userId
        )
    """)
    List<AdMentorUserDTO> findUsersByMentorRegion(@Param("userId") Long userId);

}

