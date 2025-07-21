package com.jibangyoung.domain.admin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jibangyoung.domain.admin.dto.AdUserDTO;
import com.jibangyoung.domain.admin.service.AdUserService;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;

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
    
}
