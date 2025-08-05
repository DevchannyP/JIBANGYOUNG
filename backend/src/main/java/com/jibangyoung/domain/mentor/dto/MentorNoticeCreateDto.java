package com.jibangyoung.domain.mentor.dto;

import com.jibangyoung.domain.mentor.entity.MentorNotice;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorNoticeCreateDto {
    
    @NotBlank(message = "제목을 입력해주세요.")
    private String title;
    
    @NotBlank(message = "내용을 입력해주세요.")
    private String content;
    
    @NotNull(message = "지역을 선택해주세요.")
    private Integer regionId;
    
    private String fileUrl;
    
    public MentorNotice toEntity(Long authorId) {
        return MentorNotice.builder()
                .title(title)
                .content(content)
                .authorId(authorId)
                .regionId(regionId)
                .fileUrl(fileUrl)
                .build();
    }
}