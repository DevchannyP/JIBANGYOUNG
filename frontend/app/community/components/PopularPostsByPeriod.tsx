// app/community/components/PopularPostsByPeriod.tsx (서버 컴포넌트)

import PopularCard from "./PopularCard";
import { PostListDto } from "../types";
import { fetchPopularPostsByPeriod } from "../hooks/usePopularPostsDate";

interface Props {
  period: "today" | "week" | "month";
  title: string;
}

export default async function PopularPostsByPeriod({ period, title }: Props) {
  let posts: PostListDto[] = [];

  try {
    posts = await fetchPopularPostsByPeriod(period);
  } catch (error) {
    return <div>❌ {title} 인기글을 불러오는 데 실패했습니다.</div>;
  }

  return <PopularCard title={title} posts={posts} />;
}
