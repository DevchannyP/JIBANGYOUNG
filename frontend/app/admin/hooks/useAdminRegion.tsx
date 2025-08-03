import { fetchAdminRegion } from "@/libs/api/admin/admin.api";
import { AdminRegion } from "@/types/api/adminRegion";
import { useEffect, useState } from "react";

export interface RegionTabOption {
  code: number;
  name: string;
}

export function useAdminRegion() {
  const [regionOptions, setRegionOptions] = useState<RegionTabOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminRegion()
      .then((data) => {
        // ✅ 지역 코드 1000 단위로 정규화
        const mapped = data.map((item: AdminRegion) => ({
          code: Math.floor(item.region_code / 1000) * 1000,
          name: item.sido,
        }));

        // ✅ 중복 제거 (동일한 code가 여러 번 들어올 경우)
        const deduped = Array.from(
          new Map(mapped.map((item) => [item.code, item])).values()
        );

        // ✅ '전체' 항목을 맨 앞에 추가
        setRegionOptions([{ code: 0, name: "전체" }, ...deduped]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { regionOptions, loading };
}
