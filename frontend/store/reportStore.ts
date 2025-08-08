import { create } from 'zustand';

type ReportType = 'COMMENT' | 'ETC' | 'POLICY' | 'POST' | 'USER';

// Record<string, any> 타입을 사용하여 어떤 키값이든 받을 수 있는 유연한 객체로 정의
interface ReportDetails {
  [key: string]: any;
}

interface ReportState {
  isOpen: boolean;
  reportType: ReportType | null;
  targetId: number | string | null;
  details: ReportDetails | null; // 상세 정보를 저장할 상태 추가
  openReportModal: (type: ReportType, id: number | string, details?: ReportDetails) => void;
  closeReportModal: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  isOpen: false,
  reportType: null,
  targetId: null,
  details: null, // 초기값은 null
  openReportModal: (type, id, details = {}) => 
    set({ isOpen: true, reportType: type, targetId: id, details }),
  closeReportModal: () => 
    set({ isOpen: false, reportType: null, targetId: null, details: null }),
}));
