import { AdMentorLogList } from "@/types/api/adMentorLogList";

interface MentorLogRowProps {
  log: AdMentorLogList & { regionName?: string }; // regionName 확장
  index: number;
  ITEMS_PER_PAGE: number;
  currentPage: number;
}

export function MentorLogRow({
  log,
  index,
  ITEMS_PER_PAGE,
  currentPage,
}: MentorLogRowProps) {
  return (
    <tr>
      {/* NO 컬럼: 전체순번 */}
      <td>
        {(ITEMS_PER_PAGE * (currentPage - 1) + index + 1)
          .toString()
          .padStart(2, "0")}
      </td>
      <td>{log.nickname}</td>
      <td>{log.role}</td>
      {/* 지역명 먼저, 없으면 코드 출력 */}
      <td>{log.regionName ?? log.regionId}</td>
      <td>{log.postCount}</td>
      <td>{log.commentCount}</td>
      <td>{log.reportProcessed}</td>
    </tr>
  );
}
