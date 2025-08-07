// ProfileService.java
package com.jibangyoung.domain.mypage.service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.auth.repository.UserRepository;
import com.jibangyoung.domain.mypage.dto.UserProfileDto;
import com.jibangyoung.domain.mypage.exception.MyPageException;
import com.jibangyoung.global.exception.ErrorCode;
import com.jibangyoung.global.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?[0-9\\-]{7,16}$");

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "사용자 정보를 찾을 수 없습니다."));
        return UserProfileDto.from(user); // User → UserProfileDto
    }

    @Transactional
    public void updateUserProfile(Long userId, String nickname, String phone, String profileImageUrl, String region) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, "사용자가 없습니다."));

        validateNickname(nickname);
        validatePhone(phone);

        // User 엔티티의 updateProfile 메서드와 setRegion 메서드 활용
        user.updateProfile(nickname, phone, profileImageUrl);
        user.setRegion(region);
        // JPA Dirty Checking → 별도 save 필요 없음(변경 감지)
    }

    private void validateNickname(String nickname) {
        if (nickname == null || nickname.isBlank())
            throw new MyPageException(ErrorCode.INVALID_INPUT_VALUE, "닉네임을 입력해주세요.");
        if (nickname.length() > 16)
            throw new MyPageException(ErrorCode.INVALID_INPUT_VALUE, "닉네임은 최대 16자까지 가능합니다.");
    }

    private void validatePhone(String phone) {
        if (phone != null && !phone.isBlank() && !PHONE_PATTERN.matcher(phone).matches())
            throw new MyPageException(ErrorCode.INVALID_INPUT_VALUE, "전화번호 형식이 올바르지 않습니다.");
    }
}
