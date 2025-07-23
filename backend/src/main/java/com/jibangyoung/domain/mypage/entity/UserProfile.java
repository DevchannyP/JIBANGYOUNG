package com.jibangyoung.domain.mypage.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "users",  // ✅ 기존 user_profile → users 테이블로 변경
    indexes = {
        @Index(name = "idx_users_region", columnList = "region"),
        @Index(name = "idx_users_role", columnList = "role")
    }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = 36)
    private String username;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "nickname", nullable = false, length = 50)
    private String nickname;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "role", nullable = false, length = 20)
    private String role;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "profile_image_url", length = 200)
    private String profileImageUrl;

    @Column(name = "region", length = 100)
    private String region;

    @Column(name = "birth_date", length = 20)
    private String birthDate;

    @Column(name = "gender", length = 10)
    private String gender;

    // 아래는 users 테이블 내 기타 컬럼(불필요하면 생략)
    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;
}
