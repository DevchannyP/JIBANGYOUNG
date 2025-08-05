package com.jibangyoung.domain.mentor.repository;

import com.jibangyoung.domain.mentor.entity.MentorNotice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorNoticeRepository extends JpaRepository<MentorNotice, Long> {
    
    // 지역별 공지사항 조회 (페이징)
    @Query("SELECT mn FROM MentorNotice mn WHERE mn.regionId = :regionId ORDER BY mn.createdAt DESC")
    Page<MentorNotice> findByRegionIdOrderByCreatedAtDesc(@Param("regionId") Long regionId, Pageable pageable);
    
    // 제목으로 검색 (지역별)
    @Query("SELECT mn FROM MentorNotice mn WHERE mn.regionId = :regionId AND mn.title LIKE %:keyword% ORDER BY mn.createdAt DESC")
    Page<MentorNotice> findByRegionIdAndTitleContainingOrderByCreatedAtDesc(
            @Param("regionId") Long regionId, 
            @Param("keyword") String keyword, 
            Pageable pageable);
    
    // 제목으로 검색 (전체)
    @Query("SELECT mn FROM MentorNotice mn WHERE mn.title LIKE %:keyword% ORDER BY mn.createdAt DESC")
    Page<MentorNotice> findByTitleContainingOrderByCreatedAtDesc(
            @Param("keyword") String keyword, 
            Pageable pageable);
    
    // 모든 지역 공지사항 조회 (관리자용)
    @Query("SELECT mn FROM MentorNotice mn ORDER BY mn.createdAt DESC")
    Page<MentorNotice> findAllOrderByCreatedAtDesc(Pageable pageable);
    
    // 최신 공지사항 조회 (대시보드용)
    @Query("SELECT mn FROM MentorNotice mn WHERE mn.regionId = :regionId ORDER BY mn.createdAt DESC")
    List<MentorNotice> findTop5ByRegionIdOrderByCreatedAtDesc(@Param("regionId") Long regionId, Pageable pageable);
    
    // 이전 글 조회 (현재 글보다 오래된 글 중 가장 최신)
    @Query("SELECT mn FROM MentorNotice mn WHERE mn.id != :currentId AND mn.createdAt < (SELECT m.createdAt FROM MentorNotice m WHERE m.id = :currentId) ORDER BY mn.createdAt DESC")
    List<MentorNotice> findPreviousNotice(@Param("currentId") Long currentId, Pageable pageable);
    
    // 다음 글 조회 (현재 글보다 최신인 글 중 가장 오래된)
    @Query("SELECT mn FROM MentorNotice mn WHERE mn.id != :currentId AND mn.createdAt > (SELECT m.createdAt FROM MentorNotice m WHERE m.id = :currentId) ORDER BY mn.createdAt ASC")
    List<MentorNotice> findNextNotice(@Param("currentId") Long currentId, Pageable pageable);
}