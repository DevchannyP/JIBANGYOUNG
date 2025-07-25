package com.jibangyoung.domain.mypage.repository;

import com.jibangyoung.domain.auth.entity.User;
import com.jibangyoung.domain.mypage.entity.SurveyHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyHistoryRepository extends JpaRepository<SurveyHistory, Long> {

    Page<SurveyHistory> findByUserOrderByParticipatedAtDesc(User user, Pageable pageable);

    Page<SurveyHistory> findByUserOrderByIsFavoriteDescParticipatedAtDesc(User user, Pageable pageable);
}
