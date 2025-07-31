package com.jibangyoung.domain.community.dto;

import com.jibangyoung.domain.community.entity.Posts;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCreateRequestDto {

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    private String content;
    private String tag;
    private String category; // "FREE", "QUESTION", "SETTLEMENT_REVIEW" 등 문자열 입력

    private Long userId;
    private Long regionId;

    private boolean isNotice;
    private boolean isMentorOnly;

    public Posts toEntity(String thumbnailUrl, String updatedContent) {
        return Posts.builder()
                .title(title)
                .content(updatedContent)
                .tag(tag)
                .category(Posts.PostCategory.valueOf(category)) // enum 변환
                .userId(userId)
                .regionId(regionId)
                .likes(0)
                .views(0)
                .isNotice(isNotice)
                .isMentorOnly(isMentorOnly)
                .isDeleted(false)
                .thumbnailUrl(thumbnailUrl)
                .build();
    }
}
