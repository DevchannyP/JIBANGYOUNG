package com.jibangyoung.domain.admin.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor 
@NoArgsConstructor
// 사용자관리
public class AdUserDTO {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private LocalDate birth_date;
    private String role;
    private String nickname;  
    private String gender;     
    private String region;
}