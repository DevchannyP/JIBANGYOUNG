// UserStatus.java
package com.jibangyoung.domain.auth.entity;

public enum UserStatus {
    ACTIVE("활성"), DEACTIVATED("비활성"), SUSPENDED("정지"), DELETED("삭제");
    private final String description;
    UserStatus(String description) { this.description = description; }
    public String getDescription() { return description; }
}