package com.jibangyoung.domain.admin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jibangyoung.domain.admin.dto.AdUserDTO;
import com.jibangyoung.domain.admin.dto.AdUserRoleDTO;
import com.jibangyoung.domain.admin.service.AdUserService;
import lombok.RequiredArgsConstructor;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AdUserService userService;

    // 1. 유저 리스트 조회
    @GetMapping("/users")
    public List<AdUserDTO> getAllUsers() {
        return userService.getAllUsers();
    }
    // 유저 권한 변경 (일괄 변경처리 위해 POST)
    @PostMapping("/users/roles")
    public ResponseEntity<Void> updateUserRoles(@RequestBody List<AdUserRoleDTO> roleList) {
        // 테스트 코드
        System.out.println("=== 요청 도착 ===");
        roleList.forEach(dto -> System.out.println(dto.getId() + " / " + dto.getRole()));
    
        userService.updateRoles(roleList);
        return ResponseEntity.ok().build();
    }
}
