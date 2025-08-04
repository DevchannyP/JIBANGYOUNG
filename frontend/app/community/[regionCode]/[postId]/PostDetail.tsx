import { formatDetailDate } from "@/libs/utils/date";
import { DetailProps } from "../../types";
import styles from "../components/BoardList.module.css";
import RecommendationButtons from "./components/RecommendationButtons";

interface Props {
  detail: DetailProps;
}

export default function PostDetail({ detail }: Props) {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.postMeta}>
        <h2 className={styles.boardTitle}>{detail.title}</h2>
        <span>작성자: {detail.author}</span>
        <span>작성일: {formatDetailDate(detail.createdAt)}</span>
        <span>조회: {detail.views}</span>
        <span>추천: {detail.likes}</span>
      </div>
      <div
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: detail.content }}
      />
      <RecommendationButtons postId={detail.id} />
    </div>
  );
}

