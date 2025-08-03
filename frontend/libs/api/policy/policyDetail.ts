import type { PolicyDetailDto } from "@/types/api/policy";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPolicyDetail = async (NO: number): Promise<PolicyDetailDto[]> => {
  const res = await axios.get(`${API_BASE_URL}/api/policy/policyDetail/${NO}`);
  return res.data;
};