package com.jibangyoung.domain.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.admin.dto.AdUserDTO;
import com.jibangyoung.domain.admin.dto.AdUserRoleDTO;
import com.jibangyoung.domain.admin.repository.AdUserRepository;
import com.jibangyoung.domain.auth.entity.UserRole;
import com.jibangyoung.domain.auth.entity.UserStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdUserService {

    private final AdUserRepository adUserRepository;

    // 사용자 관리_조회
    public List<AdUserDTO> getAllUsers() {
        var users = adUserRepository.findAll();

        return users.stream()
            .map(user -> new AdUserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                maskPhone(user.getPhone()),
                user.getBirthDate(),
                user.getRole().name(),
                user.getNickname(),
                user.getGender(),
                user.getRegion()
            ))
            .toList();
    }

    // 사용자관리_전화번호 마스킹
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 8) {
            return phone;
        }
        return phone.replaceAll("(\\d{3})-(\\d{4})-(\\d{4})", "$1-****-$3");
    }
    
    // 사용자관리_권한 변경
    @Transactional
    public void updateRoles(List<AdUserRoleDTO> roleList) {
        for (AdUserRoleDTO dto : roleList) {
            var user = adUserRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
            // entity/User 메소드 추가 
            user.changeRole(UserRole.valueOf(dto.getRole())); 
        }
    }

    // 유저 상태 변경
    @Transactional
    public void updateUserStatus(Long userId, String status) {
        var user = adUserRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        try {
            user.changeStatus(UserStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("유효하지 않은 상태값입니다.");
        }
    }
}
