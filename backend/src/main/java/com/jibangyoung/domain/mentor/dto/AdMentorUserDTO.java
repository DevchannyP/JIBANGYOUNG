package com.jibangyoung.domain.mentor.dto;

import com.jibangyoung.domain.auth.entity.UserRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdMentorUserDTO  {
    private Long id;
    private String nickname;
    private String role;            
    private String roleDescription; 
    private int warning_count;
    private Long region_id;
    private int current_score;

    // Enum 타입 생성자 추가 (JPQL에서 사용)
    public AdMentorUserDTO(Long id, String nickname, UserRole role, int warning_count, Long region_id, int current_score) {
        this.id = id;
        this.nickname = nickname;
        this.role = (role != null) ? role.name() : null;
        this.roleDescription = (role != null) ? role.getDescription() : null; // 한글명 할당
        this.warning_count = warning_count;
        this.region_id = region_id;
        this.current_score = current_score;
    }
}
