package com.jibangyoung.domain.mentor.service;

import com.jibangyoung.domain.mentor.dto.MentorNoticeCreateDto;
import com.jibangyoung.domain.mentor.dto.MentorNoticeDto;
import com.jibangyoung.domain.mentor.dto.MentorNoticeNavigationDto;
import com.jibangyoung.domain.mentor.entity.MentorNotice;
import com.jibangyoung.domain.mentor.repository.MentorNoticeRepository;
import com.jibangyoung.domain.policy.entity.Region;
import com.jibangyoung.domain.policy.repository.RegionRepository;
import com.jibangyoung.global.exception.BusinessException;
import com.jibangyoung.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentorNoticeService {
    
    private final MentorNoticeRepository mentorNoticeRepository;
    private final RegionRepository regionRepository;
    
    // 임시 사용자 ID (관리자)
    private static final Long TEMP_ADMIN_ID = 1L;
    
    @Transactional
    public Long createNotice(MentorNoticeCreateDto createDto) {
        MentorNotice notice = createDto.toEntity(TEMP_ADMIN_ID);
        MentorNotice savedNotice = mentorNoticeRepository.save(notice);
        
        log.info("멘토 공지사항 생성 완료 - ID: {}, 제목: {}", savedNotice.getId(), savedNotice.getTitle());
        return savedNotice.getId();
    }
    
    @Transactional(readOnly = true)
    public Page<MentorNoticeDto> getNoticesByRegion(Long regionId, int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<MentorNotice> notices;
        
        if (regionId == null || regionId == 0) {
            // 전체 공지 조회
            if (keyword != null && !keyword.trim().isEmpty()) {
                notices = mentorNoticeRepository.findByTitleContainingOrderByCreatedAtDesc(keyword.trim(), pageable);
            } else {
                notices = mentorNoticeRepository.findAllOrderByCreatedAtDesc(pageable);
            }
        } else {
            // 특정 지역 공지 조회
            if (keyword != null && !keyword.trim().isEmpty()) {
                notices = mentorNoticeRepository.findByRegionIdAndTitleContainingOrderByCreatedAtDesc(
                        regionId, keyword.trim(), pageable);
            } else {
                notices = mentorNoticeRepository.findByRegionIdOrderByCreatedAtDesc(regionId, pageable);
            }
        }
        
        return notices.map(notice -> {
            Region region = regionRepository.findById(notice.getRegionId()).orElse(null);
            String regionName = region != null ? region.getSido() + " " + region.getGuGun1() : "";
            return MentorNoticeDto.fromWithRegion(notice, regionName);
        });
    }
    
    @Transactional(readOnly = true)
    public MentorNoticeDto getNoticeDetail(Long noticeId) {
        MentorNotice notice = mentorNoticeRepository.findById(noticeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOTICE_NOT_MENTOR));
                
        Region region = regionRepository.findById(notice.getRegionId()).orElse(null);
        String regionName = region != null ? region.getSido() + " " + region.getGuGun1() : "";
        
        return MentorNoticeDto.fromWithRegion(notice, regionName);
    }
    
    @Transactional(readOnly = true)
    public MentorNoticeNavigationDto getNoticeWithNavigation(Long noticeId) {
        // 현재 공지사항 조회
        MentorNotice notice = mentorNoticeRepository.findById(noticeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOTICE_NOT_MENTOR));
                
        Region region = regionRepository.findById(notice.getRegionId()).orElse(null);
        String regionName = region != null ? region.getSido() + " " + region.getGuGun1() : "";
        
        MentorNoticeDto currentNotice = MentorNoticeDto.fromWithRegion(notice, regionName);
        
        // 이전 글 조회
        Pageable pageable = PageRequest.of(0, 1);
        List<MentorNotice> previousList = mentorNoticeRepository.findPreviousNotice(noticeId, pageable);
        MentorNoticeNavigationDto.NavigationItem previous = previousList.isEmpty() ? null : 
                MentorNoticeNavigationDto.NavigationItem.builder()
                        .id(previousList.get(0).getId())
                        .title(previousList.get(0).getTitle())
                        .build();
        
        // 다음 글 조회
        List<MentorNotice> nextList = mentorNoticeRepository.findNextNotice(noticeId, pageable);
        MentorNoticeNavigationDto.NavigationItem next = nextList.isEmpty() ? null :
                MentorNoticeNavigationDto.NavigationItem.builder()
                        .id(nextList.get(0).getId())
                        .title(nextList.get(0).getTitle())
                        .build();
        
        return MentorNoticeNavigationDto.builder()
                .current(currentNotice)
                .previous(previous)
                .next(next)
                .build();
    }
    
    @Transactional(readOnly = true)
    public List<MentorNoticeDto> getRecentNotices(Long regionId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<MentorNotice> notices = mentorNoticeRepository.findTop5ByRegionIdOrderByCreatedAtDesc(regionId, pageable);
        
        return notices.stream()
                .map(notice -> {
                    Region region = regionRepository.findById(notice.getRegionId()).orElse(null);
                    String regionName = region != null ? region.getSido() + " " + region.getGuGun1() : "";
                    return MentorNoticeDto.fromWithRegion(notice, regionName);
                })
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteNotice(Long noticeId) {
        MentorNotice notice = mentorNoticeRepository.findById(noticeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOTICE_NOT_MENTOR));
                
        mentorNoticeRepository.delete(notice);
        log.info("멘토 공지사항 삭제 완료 - ID: {}", noticeId);
    }
}