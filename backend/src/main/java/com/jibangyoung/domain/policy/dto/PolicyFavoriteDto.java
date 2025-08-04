package com.jibangyoung.domain.policy.dto;

import java.util.List;

public record PolicyFavoriteDto(
        Long userId,
        List<Long> bookmarkedPolicyIds) {
}