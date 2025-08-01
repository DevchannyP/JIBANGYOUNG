'use client';

import type { PolicyDetailDto } from '@/types/api/policy';
import {
    Building,
    Calendar,
    ClipboardList,
    FileCheck2,
    FileText,
    Globe,
    Hash,
    Heart,
    ListChecks,
    MapPin,
    SlidersHorizontal,
    User,
} from 'lucide-react';

interface PolicyMainCardProps {
  policy: PolicyDetailDto;
  isBookmarked: boolean;
  onBookmark: () => void;
}

const calculateDDay = (deadline: string): { text: string; isUrgent: boolean; warning: boolean } => {
  if (deadline === '2099-12-31' || deadline === '9999-12-31') {
    return { text: '상시', isUrgent: false, warning: false };
  }

  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: '마감', isUrgent: true, warning: false };
  if (diffDays === 0) return { text: 'D-day', isUrgent: true, warning: false };
  if (diffDays <= 7) return { text: `D-${diffDays}`, isUrgent: true, warning: false };
  if (diffDays <= 30) return { text: `D-${diffDays}`, isUrgent: false, warning: true };
  return { text: `D-${diffDays}`, isUrgent: false, warning: false };
};

export default function PolicyMainCard({
  policy,
  isBookmarked,
  onBookmark,
}: PolicyMainCardProps) {
  const dDayInfo = calculateDDay(policy.deadline);

  return (
    <div className="policy-main-card">
      <div className="policy-header">
        <div className="policy-badges">
          <span className="policy-region">{policy.sidoName || '지역 미등록'}</span>
          <span
            className={`policy-dday ${dDayInfo.isUrgent ? 'urgent' : ''} ${
              dDayInfo.warning ? 'warning' : ''
            }`}
          >
            {dDayInfo.text}
          </span>
        </div>
        <button className="favorite-btn" onClick={onBookmark} aria-label="북마크 토글">
          <Heart
            className={`heart-icon ${isBookmarked ? 'bookmarked' : ''}`}
            fill={isBookmarked ? '#6366f1' : 'none'}
          />
        </button>
      </div>

      <h1 className="policy-title">{policy.plcy_nm}</h1>

      <div className="policy-info">
        {policy.sidoName && (
          <div className="info-row">
            <MapPin className="info-icon" />
            <span className="info-label">대상지</span>
            <div className="info-content">{policy.sidoName}</div>
          </div>
        )}

        {policy.deadline && (
          <div className="info-row">
            <Calendar className="info-icon" />
            <span className="info-label">신청 마감</span>
            <div className="info-content">~ {policy.deadline}</div>
          </div>
        )}

        {policy.aply_url_addr && (
          <div className="info-row">
            <Globe className="info-icon" />
            <span className="info-label">신청 URL</span>
            <div className="info-content">
              <a href={policy.aply_url_addr} target="_blank" rel="noopener noreferrer" className="website-link">
                {policy.aply_url_addr}
              </a>
            </div>
          </div>
        )}

        {policy.plcy_sprt_cn && (
          <div className="info-row">
            <FileText className="info-icon" />
            <span className="info-label">지원내용</span>
            <div className="info-content">{policy.plcy_sprt_cn}</div>
          </div>
        )}

        {policy.oper_inst_nm && (
          <div className="info-row">
            <Building className="info-icon" />
            <span className="info-label">운영기관</span>
            <div className="info-content">{policy.oper_inst_nm}</div>
          </div>
        )}

        {policy.ptcp_prp_trgt_cn && (
          <div className="info-row">
            <User className="info-icon" />
            <span className="info-label">참여자격</span>
            <div className="info-content">{policy.ptcp_prp_trgt_cn}</div>
          </div>
        )}

        {(policy.ref_url_addr1 || policy.ref_url_addr2) && (
          <div className="info-row">
            <Globe className="info-icon" />
            <span className="info-label">참고 URL</span>
            <div className="info-content">
              {policy.ref_url_addr1 && (
                <div>
                  <a href={policy.ref_url_addr1} target="_blank" rel="noopener noreferrer" className="website-link">
                    {policy.ref_url_addr1}
                  </a>
                </div>
              )}
              {policy.ref_url_addr2 && (
                <div>
                  <a href={policy.ref_url_addr2} target="_blank" rel="noopener noreferrer" className="website-link">
                    {policy.ref_url_addr2}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {policy.sprt_scl_cnt !== null && (
          <div className="info-row">
            <Hash className="info-icon" />
            <span className="info-label">지원 규모</span>
            <div className="info-content">{policy.sprt_scl_cnt}명</div>
          </div>
        )}

        {policy.plcy_aply_mthd_cn && (
          <div className="info-row">
            <ClipboardList className="info-icon" />
            <span className="info-label">신청 방법</span>
            <div className="info-content">{policy.plcy_aply_mthd_cn}</div>
          </div>
        )}

        {policy.add_aply_qlfc_cnd_cn && (
          <div className="info-row">
            <ListChecks className="info-icon" />
            <span className="info-label">추가 자격</span>
            <div className="info-content">{policy.add_aply_qlfc_cnd_cn}</div>
          </div>
        )}
        {(policy.sprt_trgt_min_age !== null || policy.sprt_trgt_max_age !== null) && (
            <div className="info-row">
                <User className="info-icon" />
                <span className="info-label">지원 연령</span>
                <div className="info-content">
            {(policy.sprt_trgt_min_age === 0 && (policy.sprt_trgt_max_age === 0 || policy.sprt_trgt_max_age >= 99)) ? (
                '나이 제한 없음'
            ) : (
                <>
            {policy.sprt_trgt_min_age ?? '미지정'}세 ~ {policy.sprt_trgt_max_age ?? '미지정'}세
            </>
             )}
            </div>
        </div>
        )}

        {policy.etc_mttr_cn && (
          <div className="info-row">
            <SlidersHorizontal className="info-icon" />
            <span className="info-label">기타사항</span>
            <div className="info-content">{policy.etc_mttr_cn}</div>
          </div>
        )}

        {policy.sbmsn_dcmnt_cn && (
          <div className="info-row">
            <FileCheck2 className="info-icon" />
            <span className="info-label">제출서류</span>
            <div className="info-content">{policy.sbmsn_dcmnt_cn}</div>
          </div>
        )}

        {policy.srng_mthd_cn && (
          <div className="info-row">
            <ClipboardList className="info-icon" />
            <span className="info-label">심사방법</span>
            <div className="info-content">{policy.srng_mthd_cn}</div>
          </div>
        )}
      </div>
    </div>
  );
}
