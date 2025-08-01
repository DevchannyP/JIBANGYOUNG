"use client";

import type { PolicyDetailDto } from "@/types/api/policy";
import { useRouter } from "next/navigation";

interface PolicyCardProps {
  policy: PolicyDetailDto;
  cardNumber: number;
}

export default function PolicyCard({ policy, cardNumber }: PolicyCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/policy_detail/${policy.NO}`);
  };

  const getDDayColor = (dDay: number) => {
    if (dDay <= 7) return "#ea4335"; // 빨간색
    if (dDay <= 30) return "#fbbc04"; // 노란색
    return "#34a853"; // 초록색
  };

  return (
    <div className="policy-card" onClick={handleCardClick}>
      <div className="card-number">{cardNumber}</div>
      <div 
        className="card-dday" 
        style={{ backgroundColor: getDDayColor(Number(policy.dDay)) }}
      >
        D-{policy.dDay}
      </div>
      
      <h3 className="card-title">{policy.plcy_nm}</h3>
      <div className="card-organization">{policy.oper_inst_nm}</div>
      <div className="card-category">{policy.sidoName}</div>
    </div>
  );
}