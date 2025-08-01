"use client";

import type { PolicyDetailDto } from "@/types/api/policy";
import { Building, Calendar, FileText, Heart, MapPin } from "lucide-react";

interface PolicyMainCardProps {
  policy: PolicyDetailDto;
  isBookmarked: boolean;
  onBookmark: () => void;
}

export default function PolicyMainCard({ 
  policy, 
  isBookmarked, 
  onBookmark 
}: PolicyMainCardProps) {
  const getDDayClass = (dDay: number) => {
    if (dDay <= 7) return "policy-dday urgent";
    if (dDay <= 30) return "policy-dday warning";
    return "policy-dday";
  };

  return (
    <div className="policy-main-card">
      <div className="policy-header">
        <div className="policy-badges">
          <span className="policy-category">청년</span>
          <span className="policy-region">{policy.sidoName}</span>
          <span className={getDDayClass(Number(policy.dDay))}>
            {policy.dDay}
          </span>
        </div>
        <button 
          className="favorite-btn"
          onClick={onBookmark}
        >
          <Heart 
            className={`heart-icon ${isBookmarked ? 'bookmarked' : ''}`}
            fill={isBookmarked ? "#ea4335" : "none"}
          />
        </button>
      </div>

      <h1 className="policy-title">{policy.plcy_nm}</h1>

      <div className="policy-info">
        <div className="info-row">
          <MapPin className="info-icon" />
          <span className="info-label">대상지</span>
          <div className="info-content">
            <div>{policy.sidoName}</div>
          </div>
        </div>

        <div className="info-row">
          <Calendar className="info-icon" />
          <span className="info-label">신청일</span>
          <div className="info-content">
            <div>~ {policy.deadline}</div>
            <div>2달 뒤 실시 600일 자격</div>
          </div>
        </div>

        <div className="info-row">
          <Building className="info-icon" />
          <span className="info-label">신청 URL</span>
          <div className="info-content">
            <div>
              <a 
                href={policy.aply_url_addr} 
                target="_blank" 
                rel="noopener noreferrer"
                className="website-link"
              >
                {policy.aply_url_addr}
              </a>
            </div>
          </div>
        </div>

        <div className="info-row">
          <FileText className="info-icon" />
          <span className="info-label">지원내용</span>
          <div className="info-content">
            <div>{policy.plcy_sprt_cn}</div>
          </div>
        </div>

        <div className="info-row">
          <Building className="info-icon" />
          <span className="info-label">운영기관</span>
          <div className="info-content">
            <div>{policy.oper_inst_nm}</div>
          </div>
        </div>
      </div>
    </div>
  );
}