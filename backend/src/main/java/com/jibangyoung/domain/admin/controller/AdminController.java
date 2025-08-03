package com.jibangyoung.domain.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jibangyoung.domain.admin.dto.AdPostDTO;
import com.jibangyoung.domain.admin.dto.AdRegionDTO;
import com.jibangyoung.domain.admin.dto.AdUserDTO;
import com.jibangyoung.domain.admin.dto.AdUserRoleDTO;
import com.jibangyoung.domain.admin.service.AdPostService;
import com.jibangyoung.domain.admin.service.AdRegionService;
import com.jibangyoung.domain.admin.service.AdUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdUserService userService;
    private final AdPostService postService;
    private final AdRegionService regionService;

    // [유저관리]
    @GetMapping("/users")
    public List<AdUserDTO> getAllUsers() {
        System.out.println("유저성공");
        return userService.getAllUsers();
    }

    @PutMapping("/users/roles")
    public ResponseEntity<Void> updateUserRoles(@RequestBody List<AdUserRoleDTO> roleList) {
        userService.updateRoles(roleList);
        return ResponseEntity.ok().build();
    }

    // [게시글관리]
    @GetMapping("/posts")
    public List<AdPostDTO> getAllPosts() {
        return postService.getAllPosts();
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    // [시/도 목록 반환]
    @GetMapping("/region")
    public List<AdRegionDTO> getSidoList() {
        System.out.println("[DEBUG] /api/admin/region 호출됨");
        List<AdRegionDTO> list = regionService.getSidoList();
        System.out.println("[DEBUG] regionService.getSidoList() 결과: " + list);
        return list;
    }
}
