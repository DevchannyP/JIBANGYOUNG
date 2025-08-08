package com.jibangyoung.domain.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.auth.dto.PasswordUpdateRequestDto;
import com.jibangyoung.domain.auth.dto.SignupRequestDto;
import com.jibangyoung.domain.auth.dto.UserDto;
import com.jibangyoung.domain.auth.dto.UserInfoDto;
import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.entity.UserRole;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.global.exception.BusinessException;
import com.jibangyoung.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원 생성 (회원가입)
    public User createUser(SignupRequestDto signupRequest) {
        String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());
        User user = User.createUser(
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                encodedPassword,
                signupRequest.getNickname(),
                signupRequest.getPhone(),
                signupRequest.getProfileImageUrl(),
                signupRequest.getBirthDate(),
                signupRequest.getGender(),
                signupRequest.getRegion(),
                UserRole.USER);
        return userRepository.save(user);
    }

    public void updateUserPassword(Long userId, PasswordUpdateRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD);
        }
        if (!dto.isNewPasswordMatching()) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }
        user.updatePassword(passwordEncoder.encode(dto.getNewPassword()));
        log.info("사용자 {} 비밀번호 변경 완료", user.getUsername());
    }

    public void updateLastLogin(User user) {
        user.updateLastLogin();
        userRepository.save(user); // dirty checking으로도 반영되나 명시적 저장
    }

    public UserDto updateUserProfile(Long userId, String nickname, String phone, String profileImageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.updateProfile(nickname, phone, profileImageUrl);
        return UserDto.from(user);
    }

    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.deactivate();
    }

    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.activate();
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return UserDto.from(user);
    }

    // ====== ✅ 추가: 컨트롤러가 기대하는 엔티티 반환 메서드 ======

    @Transactional(readOnly = true)
    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public User getUserEntityByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public UserInfoDto getUserInfo(Long id) {
        return UserInfoDto.from(getUserEntityById(id));
    }

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

}
