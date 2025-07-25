package com.jibangyoung.domain.mypage.entity;

import com.jibangyoung.domain.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 관심지역 알림 엔티티
 * - Slice 페이징/정렬 최적화를 위한 복합 인덱스 구성
 * - 추후 알림 유형·읽음처리 확장 고려
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "alert", indexes = {
    @Index(name = "idx_user_createdAt", columnList = "user_id, createdAt")
})
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String region;

    @Column(nullable = false, length = 200)
    private String message;

    @Column(nullable = false)
    private boolean isRead;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 정적 팩토리: 신규 알림 생성
    public static Alert of(User user, String region, String message) {
        Alert alert = new Alert();
        alert.user = user;
        alert.region = region;
        alert.message = message;
        alert.isRead = false;
        alert.createdAt = LocalDateTime.now();
        return alert;
    }

    public void markAsRead() {
        this.isRead = true;
    }
}
