import { DetailProps } from "../../types";

interface Props {
  detail: DetailProps;
}

export default function PostDetail({ detail }: Props) {
  return (
    <article>
      <h2>{detail.title}</h2>
      <div>
        <span>{detail.author}</span>
        <span>{detail.createdAt}</span>
        <span>조회 {detail.views}</span>
        <span>추천 {detail.likes}</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: detail.content }} />
    </article>
  );
}
