// User.java
package com.jibangyoung.domain.auth.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 정적 팩토리 메서드 (권한 구분)
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
        user.role = role;
        user.status = UserStatus.ACTIVE;
        return user;
    }

    public static User createUser(String username, String email, String password,
                                 String nickname, String phone, String profileImageUrl,
                                 LocalDate birthDate, String gender, String region) {
        return createUser(username, email, password, nickname, phone, profileImageUrl, birthDate, gender, region, UserRole.USER);
    }

    // 비즈니스 메서드
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
    public boolean isMentorA() { return this.role == UserRole.MENTOR_A; }
    public boolean isMentorB() { return this.role == UserRole.MENTOR_B; }
    public boolean isMentorC() { return this.role == UserRole.MENTOR_C; }
    public boolean isMentor() {
        return this.role == UserRole.MENTOR_A
            || this.role == UserRole.MENTOR_B
            || this.role == UserRole.MENTOR_C;
    }


    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
    // 관리자페이지_사용자관리(권한변경)
    public void changeRole(UserRole newRole) {
        this.role = newRole;
    }
}