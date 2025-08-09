package com.jibangyoung.domain.mentor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.mentor.entity.MentorTest;

public interface  AdMentorRepository  extends JpaRepository<MentorTest, Long>{
    boolean existsByUserIdAndRegionId(Long userId, Long regionId);
}
