import { fetchPopularPosts } from "@/libs/api/community/community.api";
import styles from "../Community.module.css";
import PaginationClient from "../components/PaginationClient";
import PopularPostsByPeriod from "../components/PopularPostsByPeriod";
import PopularPostTable from "../components/PopularPostTable";
import RegionSelector from "../components/RegionSelector"; // RegionSelector 임포트

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function CommunityPage({ searchParams }: Props) {
  const pageParam = (await searchParams).page ?? "1";
  const currentPage = parseInt(pageParam, 10);

  const { posts, totalPages } = await fetchPopularPosts(currentPage);
  console.log(posts);
  return (
    <div className="community-page">
      <main className={styles["community-container"]}>
        <RegionSelector />
        <section className={styles["popular-section"]}>
          <div>
            <PopularPostsByPeriod period="week" title="주간 인기" />
          </div>
          <div>
            <PopularPostsByPeriod period="today" title="일간 인기" />
          </div>
        </section>
        <div className="community-container">
          <PopularPostTable posts={posts} />
          <PaginationClient totalPages={totalPages} />
        </div>
      </main>
    </div>
  );
}
