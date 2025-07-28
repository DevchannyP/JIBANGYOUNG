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
        // 변환: {region_code, sido} → {code, name}
        const mapped = data.map((item: AdminRegion) => ({
          code: item.region_code,
          name: item.sido,
        }));
        setRegionOptions(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { regionOptions, loading };
}
