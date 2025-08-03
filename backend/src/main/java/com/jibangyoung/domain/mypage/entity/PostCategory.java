package com.jibangyoung.domain.mypage.entity;

import lombok.Getter;

@Getter
public enum PostCategory {
    FREE("자유"),
    QUESTION("질문"),
    REVIEW("후기"),
    NOTICE("공지");
    private final String label;
    PostCategory(String label) {
        this.label = label;
    }
}
