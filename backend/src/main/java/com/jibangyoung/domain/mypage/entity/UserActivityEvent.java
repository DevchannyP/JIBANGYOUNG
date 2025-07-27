package com.jibangyoung.domain.mypage.entity;

import java.time.LocalDateTime;

import com.jibangyoung.domain.auth.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_activity_event")
public class UserActivityEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "region_id", nullable = false)
    private Long regionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ActionType actionType;

    @Column(name = "score_delta")
    private int scoreDelta;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public enum ActionType {
        POST, COMMENT, MENTORING, REPLY, POLICY_LIKE, POLICY_VOTE, REPORT, REVIEW, PROFILE_EDIT, LOGIN, ADMIN, SYSTEM,
        ETC
    }
}
