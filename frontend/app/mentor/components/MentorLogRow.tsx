import { AdMentorLogList } from "@/types/api/adMentorLogList";

interface MentorLogRowProps {
  log: AdMentorLogList;
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
      <td>{log.regionId ? log.regionId : log.regionId}</td>
      <td>{log.postCount}</td>
      <td>{log.commentCount}</td>
      <td>{log.reportProcessed}</td>
    </tr>
  );
}
