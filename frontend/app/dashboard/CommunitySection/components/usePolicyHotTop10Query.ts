import { getPolicyHotTop10, PolicyHotDto } from "@/libs/api/dashboard/policyhot.api";
import { useQuery } from "@tanstack/react-query";

export function usePolicyHotTop10Query() {
  return useQuery<PolicyHotDto[], Error>({
    queryKey: ["policyHotTop10"],
    queryFn: getPolicyHotTop10,
    staleTime: 1000 * 60 * 5,
  });
}
