package com.jibangyoung.domain.mypage.repository;

import com.jibangyoung.domain.mypage.entity.SurveyFavorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyFavoriteRepository extends JpaRepository<SurveyFavorite, Long> {
    Page<SurveyFavorite> findByUserIdAndIsFavoriteTrue(Long userId, Pageable pageable);
}
