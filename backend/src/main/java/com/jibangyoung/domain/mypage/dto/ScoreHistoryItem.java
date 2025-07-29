package com.jibangyoung.domain.mypage.dto;

import java.time.LocalDateTime;

public record ScoreHistoryItem(
                LocalDateTime date,
                int delta,
                String reason) {
}
