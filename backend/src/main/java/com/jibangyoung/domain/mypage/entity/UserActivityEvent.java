package com.jibangyoung.domain.mypage.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_activity_event", indexes = {
        @Index(name = "idx_user_region_time", columnList = "userId, regionId, createdAt")
})
public class UserActivityEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Integer regionId;
    private String actionType;
    private Long refId;
    private Long parentRefId; // ← 추가
    private Integer actionValue; // ← 추가
    private Integer scoreDelta;

    @Column(columnDefinition = "json")
    private String meta; // JSON string

    private String ipAddr;
    private String userAgent;
    private String platform;
    private String lang;
    private String status;
    private String memo;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public UserActivityEvent(Long userId, Integer regionId, String actionType,
            Long refId, Long parentRefId, Integer actionValue, Integer scoreDelta,
            String meta, String ipAddr, String userAgent, String platform,
            String lang, String status, String memo,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.userId = userId;
        this.regionId = regionId;
        this.actionType = actionType;
        this.refId = refId;
        this.parentRefId = parentRefId;
        this.actionValue = actionValue;
        this.scoreDelta = scoreDelta;
        this.meta = meta;
        this.ipAddr = ipAddr;
        this.userAgent = userAgent;
        this.platform = platform;
        this.lang = lang;
        this.status = status;
        this.memo = memo;
        this.createdAt = createdAt == null ? LocalDateTime.now() : createdAt;
        this.updatedAt = updatedAt == null ? LocalDateTime.now() : updatedAt;
    }
}
