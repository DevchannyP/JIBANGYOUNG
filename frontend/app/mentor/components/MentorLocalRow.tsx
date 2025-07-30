import { AdMentorUser } from "@/types/api/adMentorUser";

interface RegionOption {
  code: number;
  name: string;
}

interface Props {
  user: AdMentorUser;
  index: number;
  totalCount: number;
  ITEMS_PER_PAGE: number;
  currentPage: number;
  regionOptions: RegionOption[];
}
export function MentorLocalRow({
  user,
  index,
  totalCount,
  ITEMS_PER_PAGE,
  currentPage,
  regionOptions,
}: Props) {
  const order = totalCount - ((currentPage - 1) * ITEMS_PER_PAGE + index);

  // region_id로 지역명 찾기
  const region = regionOptions.find((r) => r.code === user.region_id);
  const regionName = region ? region.name : user.region_id;

  return (
    <tr>
      <td>{order}</td>
      <td>{user.nickname}</td>
      <td>{user.role}</td>
      <td>{user.warning_count}</td>
      <td>{regionName}</td>
      <td>{user.current_score}</td>
    </tr>
  );
}
