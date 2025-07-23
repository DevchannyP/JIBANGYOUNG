package com.jibangyoung.domain.mypage.repository;

import com.jibangyoung.domain.mypage.entity.UserComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCommentRepository extends JpaRepository<UserComment, Long> {
    List<UserComment> findByUserId(Long userId);
}
