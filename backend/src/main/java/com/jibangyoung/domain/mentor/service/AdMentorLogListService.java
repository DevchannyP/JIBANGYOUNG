package com.jibangyoung.domain.mentor.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jibangyoung.domain.mentor.dto.AdMentorLogListDTO;
import com.jibangyoung.domain.mentor.repository.AdMentorLogListQueryRepository;
import com.jibangyoung.domain.mentor.repository.AdMentorUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdMentorLogListService {

    private final AdMentorLogListQueryRepository adMentorLogListQueryRepository;
    private final AdMentorUserRepository adMentorUserRepository;

    // 멘토 데시보드_멘토 활동로그 리스트
    public List<AdMentorLogListDTO> getMentorLogList(Long userId, boolean isAdmin) {

        if (isAdmin) {
            return adMentorLogListQueryRepository.findMentorLogListAllRegions();
        }

        List<Long> regionIds = adMentorUserRepository.findRegionIdByUserId(userId);

        if (regionIds == null || regionIds.isEmpty()) {
            return List.of(); // region이 없을 경우 빈 리스트 반환
        }

        // QueryDSL 통계 Repository로 위임
        return adMentorLogListQueryRepository.findMentorLogListByRegionIds(regionIds);
    }
}