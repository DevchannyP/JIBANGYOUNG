package com.jibangyoung.domain.mypage.dto;

import java.time.LocalDateTime;

// 변경: Posts로 import
import com.jibangyoung.domain.community.entity.Posts;
import com.jibangyoung.domain.community.entity.Posts.PostCategory; // 카테고리도 Posts 내부 enum 사용

import lombok.Builder;

@Builder
public record PostPreviewDto(
        Long id,
        String title,
        PostCategory category,
        String tag, // null 허용
        int likes,
        int views,
        boolean isNotice,
        boolean isMentorOnly,
        LocalDateTime createdAt) {

    // 변경: Post → Posts
    public static PostPreviewDto from(Posts post) {
        return PostPreviewDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .category(post.getCategory())
                .tag(post.getTag())
                .likes(post.getLikes())
                .views(post.getViews())
                .isNotice(post.isNotice())
                .isMentorOnly(post.isMentorOnly())
                .createdAt(post.getCreatedAt())
                .build();
    }
}
