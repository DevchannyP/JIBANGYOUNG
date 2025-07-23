package com.jibangyoung.domain.mypage.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jibangyoung.domain.mypage.dto.AlertDto;
import com.jibangyoung.domain.mypage.dto.CommentPreviewDto;
import com.jibangyoung.domain.mypage.dto.PostPreviewDto;
import com.jibangyoung.domain.mypage.dto.ReportDto;
import com.jibangyoung.domain.mypage.dto.UserProfileDto;
import com.jibangyoung.domain.mypage.dto.UserSurveyDto;
import com.jibangyoung.domain.mypage.entity.UserAlert;
import com.jibangyoung.domain.mypage.entity.UserComment;
import com.jibangyoung.domain.mypage.entity.UserPost;
import com.jibangyoung.domain.mypage.entity.UserProfile;
import com.jibangyoung.domain.mypage.entity.UserReport;
import com.jibangyoung.domain.mypage.entity.UserSurvey;
import com.jibangyoung.domain.mypage.exception.MyPageException;
import com.jibangyoung.domain.mypage.repository.UserAlertRepository;
import com.jibangyoung.domain.mypage.repository.UserCommentRepository;
import com.jibangyoung.domain.mypage.repository.UserPostRepository;
import com.jibangyoung.domain.mypage.repository.UserProfileRepository;
import com.jibangyoung.domain.mypage.repository.UserReportRepository;
import com.jibangyoung.domain.mypage.repository.UserSurveyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {
    private final UserProfileRepository userProfileRepository;
    private final UserSurveyRepository userSurveyRepository;
    private final UserPostRepository userPostRepository;
    private final UserCommentRepository userCommentRepository;
    private final UserAlertRepository userAlertRepository;
    private final UserReportRepository userReportRepository;

    public UserProfileDto getUserProfile(String username) {
        UserProfile user = userProfileRepository.findByUsername(username)
            .orElseThrow(() -> new MyPageException("사용자를 찾을 수 없습니다."));
        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole())
                .status(user.getStatus())
                .region(user.getRegion())
                .birthDate(user.getBirthDate())
                .gender(user.getGender())
                .build();
    }

    @Transactional
    public void updateUserProfile(String username, UserProfileDto dto) {
        UserProfile user = userProfileRepository.findByUsername(username)
            .orElseThrow(() -> new MyPageException("사용자를 찾을 수 없습니다."));
        user.setNickname(dto.getNickname());
        user.setPhone(dto.getPhone());
        user.setProfileImageUrl(dto.getProfileImageUrl());
        user.setRegion(dto.getRegion());
        // 필요시 추가 필드 변경
    }

    public List<UserSurveyDto> getMySurveys(Long userId) {
        List<UserSurvey> surveys = userSurveyRepository.findByUserId(userId);
        return surveys.stream().map(s ->
            UserSurveyDto.builder()
                .id(s.getId())
                .title(s.getTitle())
                .isFavorite(s.isFavorite())
                .participatedAt(s.getParticipatedAt())
                .resultUrl(s.getResultUrl())
                .build()
        ).toList();
    }

    public List<UserSurveyDto> getFavoriteSurveys(Long userId) {
        List<UserSurvey> surveys = userSurveyRepository.findByUserIdAndIsFavoriteTrue(userId);
        return surveys.stream().map(s ->
            UserSurveyDto.builder()
                .id(s.getId())
                .title(s.getTitle())
                .isFavorite(s.isFavorite())
                .participatedAt(s.getParticipatedAt())
                .resultUrl(s.getResultUrl())
                .build()
        ).toList();
    }

    @Transactional
    public void removeFavoriteSurvey(Long surveyId) {
        userSurveyRepository.deleteById(surveyId);
    }

    public List<PostPreviewDto> getMyPosts(Long userId) {
        List<UserPost> posts = userPostRepository.findByUserId(userId);
        return posts.stream().map(p ->
            PostPreviewDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .region(p.getRegion())
                .createdAt(p.getCreatedAt())
                .build()
        ).toList();
    }

    public List<CommentPreviewDto> getMyComments(Long userId) {
        List<UserComment> comments = userCommentRepository.findByUserId(userId);
        return comments.stream().map(c ->
            CommentPreviewDto.builder()
                .id(c.getId())
                .content(c.getContent())
                .targetPostTitle(c.getTargetPostTitle())
                .createdAt(c.getCreatedAt())
                .build()
        ).toList();
    }

    public List<AlertDto> getMyAlerts(Long userId) {
        List<UserAlert> alerts = userAlertRepository.findByUserId(userId);
        return alerts.stream().map(a ->
            AlertDto.builder()
                .id(a.getId())
                .region(a.getRegion())
                .message(a.getMessage())
                .createdAt(a.getCreatedAt())
                .isRead(a.isRead())
                .build()
        ).toList();
    }

    public List<ReportDto> getMyReports(Long userId) {
        List<UserReport> reports = userReportRepository.findByUserId(userId);
        return reports.stream().map(r ->
            ReportDto.builder()
                .id(r.getId())
                .type(r.getType())
                .targetTitle(r.getTargetTitle())
                .reason(r.getReason())
                .reportedAt(r.getReportedAt())
                .status(r.getStatus())
                .build()
        ).toList();
    }
}
