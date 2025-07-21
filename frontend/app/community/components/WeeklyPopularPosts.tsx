// app/community/components/WeeklyPopularPosts.tsx
import PopularCard from './PopularCard';
import { fetchPopularPosts } from '@/libs/api/community.api';

export default async function WeeklyPopularPosts() {
  const posts = await fetchPopularPosts('week');
  return <PopularCard title="주간 인기" posts={posts} />;
}