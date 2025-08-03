// domain/dashboard/repository/ReviewTopRepository.java
package com.jibangyoung.domain.dashboard.repository;

import java.util.List;

import com.jibangyoung.domain.dashboard.dto.ReviewPostDto;

public interface ReviewTopRepository {
    List<ReviewPostDto> findTop3ReviewPosts();
}
