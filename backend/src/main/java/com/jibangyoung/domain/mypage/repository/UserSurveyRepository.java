package com.jibangyoung.domain.mypage.repository;

import com.jibangyoung.domain.mypage.entity.UserSurvey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSurveyRepository extends JpaRepository<UserSurvey, Long> {
    List<UserSurvey> findByUserId(Long userId);
    List<UserSurvey> findByUserIdAndIsFavoriteTrue(Long userId);
}
