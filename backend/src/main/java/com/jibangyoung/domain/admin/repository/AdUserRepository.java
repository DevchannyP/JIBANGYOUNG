package com.jibangyoung.domain.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.auth.entity.User;

@Repository
// 사용자관리_리스트조회
public interface AdUserRepository extends JpaRepository<User, Long> {
    // C → B 승격
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE User u
        SET u.role = com.jibangyoung.domain.auth.entity.UserRole.MENTOR_B,
            u.updatedAt = CURRENT_TIMESTAMP
        WHERE u.id IN :userIds
          AND u.role = com.jibangyoung.domain.auth.entity.UserRole.MENTOR_C
        """)
    int promoteCtoB(@Param("userIds") List<Long> userIds);

    // B → A 승격
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE User u
        SET u.role = com.jibangyoung.domain.auth.entity.UserRole.MENTOR_A,
            u.updatedAt = CURRENT_TIMESTAMP
        WHERE u.id IN :userIds
          AND u.role = com.jibangyoung.domain.auth.entity.UserRole.MENTOR_B
        """)
    int promoteBtoA(@Param("userIds") List<Long> userIds);
} 