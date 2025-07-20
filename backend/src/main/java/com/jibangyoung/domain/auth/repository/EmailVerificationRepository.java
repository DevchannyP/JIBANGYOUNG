package com.jibangyoung.domain.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.auth.entity.EmailVerification;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    // ✅ 이메일로 가장 최근 인증 내역 찾기
    Optional<EmailVerification> findTopByEmailOrderByCreatedAtDesc(String email);

    // ✅ 이메일로 인증 내역 모두 삭제
    void deleteByEmail(String email);
}
