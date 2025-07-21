// app/community/components/TodayPopularPosts.tsx
import PopularCard from './PopularCard';
import { fetchPopularPosts } from '@/libs/api/community.api';

export default async function TodayPopularPosts() {
  const posts = await fetchPopularPosts('today');
  return <PopularCard title="일간 인기" posts={posts} />;
}
