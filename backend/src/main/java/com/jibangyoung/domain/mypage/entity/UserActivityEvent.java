package com.jibangyoung.domain.mypage.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_activity_event", indexes = {
        @Index(name = "idx_user_region_time", columnList = "user_id, region_id, created_at")
})
public class UserActivityEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "region_id", nullable = false)
    private Integer regionId;

    @Column(name = "action_type", nullable = false, length = 32)
    private String actionType; // 예: POST, COMMENT, POLICY_LIKE 등

    @Column(name = "ref_id")
    private Long refId;

    @Column(name = "parent_ref_id")
    private Long parentRefId;

    @Column(name = "action_value")
    private Integer actionValue;

    @Column(name = "score_delta")
    private Integer scoreDelta;

    @Column(name = "meta", columnDefinition = "json")
    private String meta;

    @Column(name = "ip_addr")
    private String ipAddr;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "platform")
    private String platform;

    @Column(name = "lang")
    private String lang;

    @Column(name = "status")
    private String status;

    @Column(name = "memo")
    private String memo;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public UserActivityEvent(
            Long userId,
            Integer regionId,
            String actionType,
            Long refId,
            Long parentRefId,
            Integer actionValue,
            Integer scoreDelta,
            String meta,
            String ipAddr,
            String userAgent,
            String platform,
            String lang,
            String status,
            String memo,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
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
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
