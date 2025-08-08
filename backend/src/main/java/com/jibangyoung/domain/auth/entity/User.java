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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "uk_users_username", columnNames = "username"),
        @UniqueConstraint(name = "uk_users_email", columnNames = "email")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Column(name = "profile_image_url", length = 255)
    private String profileImageUrl;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(length = 10)
    private String gender;

    @Column(length = 100)
    private String region;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /** === 안전 가드: 기본값/길이 방어 === */
    @PrePersist
    protected void onCreate() {
        // 기본값 채우기 (누락 방지)
        if (this.role == null)
            this.role = UserRole.USER;
        if (this.status == null)
            this.status = UserStatus.ACTIVE;

        // 길이 방어 (DB 제약 초과 방지)
        this.username = trim(this.username, 50);
        this.email = trim(this.email, 100);
        this.password = trim(this.password, 255); // 인코딩된 비밀번호라도 가드
        this.nickname = trim(this.nickname, 50);
        this.phone = trim(this.phone, 20);
        this.profileImageUrl = trim(this.profileImageUrl, 255);
        this.gender = trim(this.gender, 10);
        this.region = trim(this.region, 100);

        // createdAt은 @CreatedDate로 자동 세팅됨 (Auditing 활성 필요)
    }

    @PreUpdate
    protected void onUpdate() {
        // 길이 방어
        this.username = trim(this.username, 50);
        this.email = trim(this.email, 100);
        this.password = trim(this.password, 255);
        this.nickname = trim(this.nickname, 50);
        this.phone = trim(this.phone, 20);
        this.profileImageUrl = trim(this.profileImageUrl, 255);
        this.gender = trim(this.gender, 10);
        this.region = trim(this.region, 100);
        // updatedAt은 @LastModifiedDate로 자동 세팅됨
    }

    private static String trim(String s, int max) {
        if (s == null)
            return null;
        return (s.length() <= max) ? s : s.substring(0, max);
    }

    // === 정적 팩토리 (기존 시그니처 그대로 유지) ===
    public static User createUser(String username, String email, String password,
            String nickname, String phone, String profileImageUrl,
            LocalDate birthDate, String gender, String region, UserRole role) {
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
        user.role = role; // 누락 시 @PrePersist에서 USER로 보정
        user.status = UserStatus.ACTIVE; // 누락 방지를 위해 기본 지정(추가로 @PrePersist에서도 보정)
        return user;
    }

    public static User createUser(String username, String email, String password,
            String nickname, String phone, String profileImageUrl,
            LocalDate birthDate, String gender, String region) {
        return createUser(username, email, password, nickname, phone, profileImageUrl, birthDate, gender, region,
                UserRole.USER);
    }

    // === 비즈니스 메서드 (기존 유지) ===
    public void updateProfile(String nickname, String phone, String profileImageUrl) {
        this.nickname = nickname;
        this.phone = phone;
        this.profileImageUrl = profileImageUrl;
    }

    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }

    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }

    public void deactivate() {
        this.status = UserStatus.DEACTIVATED;
    }

    public void activate() {
        this.status = UserStatus.ACTIVE;
    }

    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }

    public boolean isAdmin() {
        return this.role == UserRole.ADMIN;
    }

    public boolean isMentorA() {
        return this.role == UserRole.MENTOR_A;
    }

    public boolean isMentorB() {
        return this.role == UserRole.MENTOR_B;
    }

    public boolean isMentorC() {
        return this.role == UserRole.MENTOR_C;
    }

    public boolean isMentor() {
        return this.role == UserRole.MENTOR_A
                || this.role == UserRole.MENTOR_B
                || this.role == UserRole.MENTOR_C;
    }

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public void changeRole(UserRole newRole) {
        this.role = newRole;
    }

    public void changeStatus(UserStatus newStatus) {
        this.status = newStatus;
    }

    public void setRegion(String region) {
        this.region = region;
    }
}
