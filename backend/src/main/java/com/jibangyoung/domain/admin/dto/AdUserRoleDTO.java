package com.jibangyoung.domain.admin.dto;

import lombok.Data;

@Data
// 사용자관리(권한변경)
public class AdUserRoleDTO {
     private Long id;
     private String role;
}
