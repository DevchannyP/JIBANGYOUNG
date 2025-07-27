package com.jibangyoung.domain.mypage.entity;

import lombok.Getter;

@Getter
public enum PostCategory {
    FREE("자유"),
    QUESTION("질문"),
    SETTLEMENT_REVIEW("정착 후기");

    private final String label;

    PostCategory(String label) {
        this.label = label;
    }
}
