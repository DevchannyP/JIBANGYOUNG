package com.jibangyoung.domain.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jibangyoung.domain.admin.dto.AdPostDTO;
import com.jibangyoung.domain.community.entity.Posts;

@Repository
public interface AdPostRepository extends JpaRepository<Posts, Long> {
    // 게시글 작성자 + userId 없으면 : 탈퇴회원 처리
    @Query("SELECT new com.jibangyoung.domain.admin.dto.AdPostDTO(" +
        "p.id, p.title, u.id, p.createdAt, p.regionId, p.views, p.likes, COALESCE(u.nickname, '탈퇴회원')) " +
        "FROM Posts p LEFT JOIN com.jibangyoung.domain.auth.entity.User u ON p.userId = u.id " +
        "ORDER BY p.createdAt DESC")
    List<AdPostDTO> findAllPostWithNickname();
}

