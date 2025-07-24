import { DetailProps } from "../types";


export default function PostDetail({
  title,
  author,
  createdAt,
  views,
  likes,
  content,
}: DetailProps) {
  return (
    <article>
      <h2>{title}</h2>
      <div>
        <span>{author}</span>
        <span>{createdAt}</span>
        <span>조회 {views}</span>
        <span>추천 {likes}</span>
      </div>
      <div>{content}</div>
    </article>
  );
} 