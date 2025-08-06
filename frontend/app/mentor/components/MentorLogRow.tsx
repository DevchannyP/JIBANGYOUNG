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
      <td>
        {(ITEMS_PER_PAGE * (currentPage - 1) + index + 1)
          .toString()
          .padStart(2, "0")}
      </td>
      <td>{log.nickname}</td>
      <td>{log.roleDescription}</td>
      <td>{log.regionName ?? log.regionId}</td>
      <td>{log.postCount}</td>
      <td>{log.commentCount}</td>
      <td>{log.approvedCount}</td>
    </tr>
  );
}
