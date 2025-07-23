package com.jibangyoung.domain.mypage.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "user_report",
    indexes = { @Index(name = "idx_report_user", columnList = "user_id") }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserReport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserProfile user;

    @Column(nullable = false, length = 12)
    private String type; // "post" or "comment"

    @Column(length = 200)
    private String targetTitle;

    @Column(length = 300)
    private String reason;

    @Column(length = 30)
    private String reportedAt;

    @Column(nullable = false, length = 20)
    private String status; // "접수됨", "처리중", "처리완료"
}
