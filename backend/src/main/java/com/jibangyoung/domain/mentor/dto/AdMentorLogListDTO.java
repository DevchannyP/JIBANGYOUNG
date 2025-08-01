package com.jibangyoung.domain.mentor.dto;

import com.jibangyoung.domain.auth.entity.UserRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdMentorLogListDTO {
    private Long id;              
    private String nickname;       
    private String role;           
    private Long regionId;        
    private Long postCount;        
    private Long commentCount;      
    private Long reportProcessed;   

    // JPQL에서 enum 타입 매핑을 위한 생성자
    public AdMentorLogListDTO(Long id, String nickname, UserRole role, Long regionId, Long postCount, Long commentCount, Long reportProcessed) {
        this.id = id;
        this.nickname = nickname;
        this.role = (role != null) ? role.name() : null;
        this.regionId = regionId;
        this.postCount = postCount;
        this.commentCount = commentCount;
        this.reportProcessed = reportProcessed;
    }
}
