package com.jibangyoung.domain.mentor.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdMentorLogListService {

    // private final AdMentorLogListRepository adMentorLogListRepository;
    // private final AdMentorUserRepository adMentorUserRepository;

    // // 멘토 데시보드_멘토 활동로그 리스트
    // public List<AdMentorLogListDTO> getMentorLogList(Long userId) {
    //     List<Long> regionIds = adMentorUserRepository.findRegionIdByUserId(userId);

    //     if (regionIds == null || regionIds.isEmpty()) {
    //         return List.of(); // region이 없을 경우 빈 리스트 반환
    //     }

    //     return adMentorLogListRepository.findMentorLogListByRegionIds(regionIds);
    // }
}
