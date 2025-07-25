// libs/api/region.api.ts
import axios from "axios";
export const getRegionRanking = async (region: string) => {
  const { data } = await axios.get(`/api/region/ranking?region=${region}`);
  return data.ranking;
};
