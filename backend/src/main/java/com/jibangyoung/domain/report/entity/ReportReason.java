package com.jibangyoung.domain.report.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "report_reasons")
public class ReportReason {
    @Id
    @Column(name = "code", length = 40)
    private String code;

    @Column(name = "description", length = 255)
    private String description; 
}
