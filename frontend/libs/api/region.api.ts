// libs/api/region.api.ts
import { Region } from "@/types/api/region.d"; // 새로 정의할 타입 임포트
import axios from "axios";
import api from "../utils/api";

export const getRegionRanking = async (region: string) => {
  const { data } = await axios.get(`/api/region/ranking?region=${region}`);
  return data.ranking;
};

export const getRegionsBoard = async (): Promise<Region[]> => {
  const { data } = await api.get("/community/region");
  return data;
};
