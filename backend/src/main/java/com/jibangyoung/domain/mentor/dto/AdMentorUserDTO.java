package com.jibangyoung.domain.mentor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdMentorUserDTO  {
    private Long id;
    private String username;
    private String nickname; 
    private String role;
    private String email;
    private String phone;
    private String region;
    private String status;
}
