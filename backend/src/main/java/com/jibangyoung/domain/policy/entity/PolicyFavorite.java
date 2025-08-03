package com.jibangyoung.domain.policy.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "policy_favorites")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PolicyFavorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long policyNo;

    @Column(nullable = false)
    private LocalDateTime bookmarkedAt;

    public static PolicyFavorite of(Long userId, Long policyNo) {
        return PolicyFavorite.builder()
                .userId(userId)
                .policyNo(policyNo)
                .bookmarkedAt(LocalDateTime.now())
                .build();
    }
}
