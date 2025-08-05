package com.jibangyoung.domain.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jibangyoung.domain.mypage.entity.Report;

public interface AdReportRepository extends JpaRepository<Report, Long>{
  
} 