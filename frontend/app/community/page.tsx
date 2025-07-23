// app/community/page.tsx
import styles from "./Community.module.css";
import PaginationWrapper from "./components/PaginationWrapper";
import PostsTable from "./components/PostTable";
import RegionBoardNavigation from "./components/RegionBoardNavigation";
import TodayPopularPosts from "./components/TodayPopularPosts";
import WeeklyPopularPosts from "./components/WeeklyPopularPosts";

const posts = [
  {
    id: 10,
    region: "부산",
    title: "부산 인기글입니다.",
    author: "남도일",
    date: "2025-07-06",
    likes: 15,
    views: 26,
  },
  {
    id: 9,
    region: "제주도",
    title: "제주도 인기글입니다.",
    author: "남도일",
    date: "2025-07-06",
    likes: 15,
    views: 26,
  },
  {
    id: 8,
    region: "부산",
    title: "부산 인기글입니다.",
    author: "남도일",
    date: "2025-07-06",
    likes: 15,
    views: 26,
  },
  {
    id: 7,
    region: "제주도",
    title: "제주도 인기글입니다.",
    author: "남도일",
    date: "2025-07-06",
    likes: 15,
    views: 26,
  },
  {
    id: 6,
    region: "부산",
    title: "부산 인기글입니다.",
    author: "남도일",
    date: "2025-07-06",
    likes: 15,
    views: 26,
  },
  {
    id: 5,
    region: "제주도",
    title: "세상에 이런일이 일어나다니!",
    author: "남도일",
    date: "2025-07-06",
    likes: 15,
    views: 26,
  },
  {
    id: 4,
    region: "부산",
    title: "부산 인기글입니다.",
    author: "남도일",
    date: "2025-07-06",
    likes: 15,
    views: 26,
  },
  {
    id: 3,
    region: "제주도",
    title: "제주도 인기글입니다.",
    author: "남도일",
    date: "2025-07-06",
    likes: 15,
    views: 26,
  },
  {
    id: 2,
    region: "부산",
    title: "부산 인기글입니다.",
    author: "남도일",
    date: "2025-07-06",
    likes: 15,
    views: 26,
  },
  {
    id: 1,
    region: "제주도",
    title: "제주도 인기글입니다.",
    author: "남도일",
    date: "2025-07-06",
    likes: 15,
    views: 26,
  },
];
const regions = ["부산", "제주도", "서울", "대구", "인천"];
export default function CommunityPage() {
  return (
    <div className="community-page">
      {/* ① 페이지 전체 배경을 담당 */}
      <main className={styles["community-container"]}>
        {/*<RegionBoardNavigation regions={regions}/>*/}
        {/* ② 실제 콘텐츠 래퍼 */}
        <div>
          {/* 인기글 섹션 */}
          <section className={styles["popular-section"]}>
            <div>
              <WeeklyPopularPosts />
            </div>
            <div>
              <TodayPopularPosts />
            </div>
          </section>
        </div>
        <div className={"community-container"}>
          <PostsTable posts={posts} />
        </div>
        <div>
          <PaginationWrapper totalPages={10} />
        </div>
      </main>
    </div>
  );
}
