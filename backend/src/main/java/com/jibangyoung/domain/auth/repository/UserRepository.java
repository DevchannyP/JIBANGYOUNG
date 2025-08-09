// backend/src/main/java/com/jibangyoung/domain/auth/repository/UserRepository.java
package com.jibangyoung.domain.auth.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.entity.UserStatus;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameAndStatus(String username, UserStatus status);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.status = :status AND u.lastLoginAt < :date")
    List<User> findInactiveUsers(@Param("status") UserStatus status, @Param("date") LocalDateTime date);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate AND u.createdAt < :endDate")
    long countUsersByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // // === [비밀번호 해시코드로 변경 코드] ===
    // @Modifying(clearAutomatically = true, flushAutomatically = true)
    // @Query("update User u set u.password = :encoded where u.id = :id")
    // void updatePasswordById(@Param("id") Long id, @Param("encoded") String
    // encoded);
}
