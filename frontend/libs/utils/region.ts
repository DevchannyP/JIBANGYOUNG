import { Region } from "@/types/api/region.d";

// 지역 코드로부터 구군명을 찾는 함수
export const getGuGunNameByCode = async (regionCode: string): Promise<string> => {
  try {
    const { getRegionsBoard } = await import("@/libs/api/region.api");
    const regions: Region[] = await getRegionsBoard();
    const region = regions.find(r => r.regionCode.toString() === regionCode);
    return region?.guGun || regionCode;
  } catch (error) {
    console.error("Failed to get region name:", error);
    return regionCode;
  }
};

// 지역 코드로부터 지역 정보를 찾는 함수
export const getRegionByCode = async (regionCode: string): Promise<Region | null> => {
  try {
    const { getRegionsBoard } = await import("@/libs/api/region.api");
    const regions: Region[] = await getRegionsBoard();
    return regions.find(r => r.regionCode.toString() === regionCode) || null;
  } catch (error) {
    console.error("Failed to get region:", error);
    return null;
  }
};