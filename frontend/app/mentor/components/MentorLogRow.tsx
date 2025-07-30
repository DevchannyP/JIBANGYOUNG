import { MentorLog } from "./MentorLogList";

interface MentorLogRowProps {
  log: MentorLog;
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
      <td>{log.id.toString().padStart(2, "0")}</td>
      <td>{log.level}</td>
      <td>{log.region}</td>
      <td>{log.postCount}</td>
      <td>{log.commentCount}</td>
      <td>{log.reportProcessed}</td>
    </tr>
  );
}
