package com.jibangyoung.domain.mypage.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String nickname;
    private String phone;
    private String profileImageUrl;
    private String role;    // enum → String
    private String status;  // enum → String
    private String region;
    private String birthDate;
    private String gender;
}
