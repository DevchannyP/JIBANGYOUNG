// UserRole.java
package com.jibangyoung.domain.auth.entity;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

public enum UserRole {
    USER("사용자"),
    ADMIN("관리자"),
    MENTOR_A("멘토A"),
    MENTOR_B("멘토B"),
    MENTOR_C("멘토C");
    private final String description;
    UserRole(String description) { this.description = description; }
    public String getDescription() { return description; }
    public SimpleGrantedAuthority toGrantedAuthority() {
        return new SimpleGrantedAuthority("ROLE_" + this.name());
    }
}