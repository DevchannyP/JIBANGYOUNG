import { notFound } from "next/navigation";

export default async function RegionCommunityPage({ params }: { params: { regionCode: string } }) {
  const regionCode = params.regionCode;

  const validCodes = ["11000", "22000", "23000"]; // 실제 DB에서 동적으로 관리 가능
  if (!validCodes.includes(regionCode)) return notFound();

}
