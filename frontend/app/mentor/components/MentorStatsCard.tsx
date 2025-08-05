import { AdMentorLogList } from "@/types/api/adMentorLogList";
import styles from "../MentorStats.module.css";
import { PostCommentBarChart } from "./PostCommentBarChart";
import { ReportDoughnutChart } from "./ReportDoughnutChart";

export function MentorStatsCard({
  log,
  regionName,
}: {
  log: AdMentorLogList;
  regionName: string;
}) {
  return (
    <div className={styles.statsCard}>
      <div className={styles.cardHeader}>
        <span className={styles.region}>{regionName}</span>
        <span className={styles.role}>{log.roleDescription}</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardSection}>
          <div className={styles.sectionTitle}>공지/게시글/댓글</div>
          <PostCommentBarChart
            notice={log.noticeCount}
            post={log.postCount}
            comment={log.commentCount}
          />
        </div>
        <div className={styles.cardSection}>
          <div className={styles.sectionTitle}>신고 처리</div>
          <ReportDoughnutChart
            approved={log.approvedCount}
            ignored={log.ignoredCount}
            invalid={log.invalidCount}
            pending={log.pendingCount}
            rejected={log.rejectedCount}
            requested={log.requestedCount}
          />
        </div>
      </div>
    </div>
  );
}
