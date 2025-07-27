package com.jibangyoung.domain.mypage.dto;

import java.time.LocalDateTime;

import com.jibangyoung.domain.mypage.entity.Post;
import com.jibangyoung.domain.mypage.entity.PostCategory;

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
    public static PostPreviewDto from(Post post) {
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
