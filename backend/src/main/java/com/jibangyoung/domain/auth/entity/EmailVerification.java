package com.jibangyoung.domain.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "email_verification",
    indexes = {@Index(name = "idx_ev_email", columnList = "email")}
)
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmailVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 10)
    private String code;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // ✅ Builder와 기본생성자 모두에서 false 기본값 유지
    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;

    // 인증 내역 사용 처리 메소드
    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}
