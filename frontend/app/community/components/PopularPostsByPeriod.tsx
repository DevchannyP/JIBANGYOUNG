"use client";



import { usePopularPostsDate } from "../hooks/usePopularPostsDate";
import PopularCard from "./PopularCard";

interface Props {
  period: "today" | "week" | "month";
  title: string;
}

export default function PopularPostsByPeriod({ period, title }: Props) {
  const { data: posts = [], isLoading, isError } = usePopularPostsDate(period);

  if (isError) return <div>❌ {title} 인기글을 불러오는 데 실패했습니다.</div>;

  return <PopularCard title={title} posts={posts} />;
}
