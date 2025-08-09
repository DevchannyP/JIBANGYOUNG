package com.jibangyoung.domain.mentor.dto;

import com.jibangyoung.domain.mentor.entity.MentorNotice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorNoticeDto {
    
    private Long id;
    private String title;
    private String content;
    private Long authorId;
    private String authorName;
    private Integer regionId;
    private String regionCode;
    private String regionName;
    private String fileUrl;
    private String createdAt;
    private String updatedAt;
    
    public static MentorNoticeDto from(MentorNotice entity) {
        return MentorNoticeDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .authorId(entity.getAuthorId())
                .regionId(entity.getRegionId())
                .fileUrl(entity.getFileUrl())
                .createdAt(entity.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .updatedAt(entity.getUpdatedAt() != null ? 
                    entity.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : null)
                .build();
    }
    
    public static MentorNoticeDto fromWithRegionInfo(MentorNotice entity, String regionCode, String regionName) {
        return MentorNoticeDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .authorId(entity.getAuthorId())
                .regionId(entity.getRegionId())
                .regionCode(regionCode)
                .regionName(regionName)
                .fileUrl(entity.getFileUrl())
                .createdAt(entity.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .updatedAt(entity.getUpdatedAt() != null ? 
                    entity.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : null)
                .build();
    }
}