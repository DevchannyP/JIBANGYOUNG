package com.jibangyoung.domain.auth.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 🚫 Builder, @AllArgsConstructor 금지!
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 50)
    private String nickname;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(length = 10)
    private String gender;

    @Column(length = 100)
    private String region;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    // 🚫❌ Redis로 토큰 저장 → 아래 부분 완전히 삭제!!
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    // @com.fasterxml.jackson.annotation.JsonIgnore
    // private List<RefreshToken> refreshTokens = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 정적 팩토리 메서드 (Builder 아님)
    public static User createUser(String username, String email, String password,
    String nickname, String phone, String profileImageUrl,
    LocalDate birthDate, String gender, String region) {
        User user = new User();
        user.username = username;
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        user.phone = phone;
        user.profileImageUrl = profileImageUrl;
        user.birthDate = birthDate;
        user.gender = gender;
        user.region = region;
        user.role = UserRole.USER;
        user.status = UserStatus.ACTIVE;
        return user;
    }

    // 비즈니스 로직
    public void updateProfile(String nickname, String phone, String profileImageUrl) {
        this.nickname = nickname;
        this.phone = phone;
        this.profileImageUrl = profileImageUrl;
    }

    public void updatePassword(String newPassword) { this.password = newPassword; }

    public void updateLastLogin() { this.lastLoginAt = LocalDateTime.now(); }

    public void deactivate() { this.status = UserStatus.DEACTIVATED; }

    public void activate() { this.status = UserStatus.ACTIVE; }

    public boolean isActive() { return this.status == UserStatus.ACTIVE; }
    public boolean isAdmin() { return this.role == UserRole.ADMIN; }
    public boolean isMentor() { return this.role == UserRole.MENTOR; }
}
