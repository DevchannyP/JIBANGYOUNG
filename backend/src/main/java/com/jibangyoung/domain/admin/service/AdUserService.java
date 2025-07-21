package com.jibangyoung.domain.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.admin.dto.AdUserDTO;
import com.jibangyoung.domain.admin.repository.AdUserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdUserService {

    private final AdUserRepository adUserRepository;

    // 1.유저 리스트 조회
public List<AdUserDTO> getAllUsers() {

    // 유저 전체 조회
    var users = adUserRepository.findAll();

    // DB 조회 결과 출력확인(추후 삭제처리)
    users.forEach(user -> System.out.println(user));

    // DTO 변환 후 리턴
    return users.stream()
            .map(user -> new AdUserDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getBirthDate(),
                    user.getRole().name(),
                    maskPw(user.getPassword())
            ))
            .toList();
    }


    // 앞 4자리 + ****
    private String maskPw(String pw) {
        if (pw == null || pw.length() <= 4) return pw + "****";
        return pw.substring(0, 4) + "****";
    }
}

