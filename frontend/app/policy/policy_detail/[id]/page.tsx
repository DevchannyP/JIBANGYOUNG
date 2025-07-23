"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPolicyDetail } from "@/libs/api/policy/policyDetail";
import type { PolicyDetailDto } from "@/types/api/policy";

export default function PolicyDetailPage() {
  const { id } = useParams(); // URL에서 동적 경로 param인 id를 받음
  const [policy, setPolicy] = useState<PolicyDetailDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetchPolicyDetail(Number(id))
      .then((data) => {
        setPolicy(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching policy detail:", err);
        setError("정책 상세 정보를 불러오는데 실패했습니다.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!policy || policy.length === 0) return <div>정책을 찾을 수 없습니다.</div>;

  return (
    <div>
      {policy.map((p) => (
        <div key={p.NO}>
          <h1>{p.plcy_nm}</h1>
          <p>마감일: {p.deadline} (D-{p.dDay})</p>
          <p>지역: {p.sidoName}</p>
          <p>운영기관: {p.oper_inst_nm}</p>
          <p>지원 내용: {p.plcy_sprt_cn}</p>
          <a href={p.aply_url_addr} target="_blank" rel="noopener noreferrer">
            신청하러 가기
          </a>
        </div>
      ))}
    </div>
  );
}
