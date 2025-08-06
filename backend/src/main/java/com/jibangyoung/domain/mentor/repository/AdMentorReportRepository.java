package com.jibangyoung.domain.mentor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.mypage.entity.Report;

public interface AdMentorReportRepository extends JpaRepository<Report, Long> {

}
