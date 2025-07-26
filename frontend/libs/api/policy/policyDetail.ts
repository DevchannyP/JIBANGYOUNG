import axios from "axios";
import type { PolicyDetailDto } from "@/types/api/policy";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPolicyDetail = async (NO: number): Promise<PolicyDetailDto[]> => {
  const res = await axios.get(`${API_BASE_URL}/api/policy/policyDetail`, { params: { NO } });
  return res.data;
};