import { useQuery } from "@tanstack/react-query";
import { api } from "../../../libs/utils/api";

interface PostPreview {
  id: number;
  title: string;
  region: string;
  createdAt: string;
}

export default function MyPostList() {
  const { data, isLoading } = useQuery<{ posts: PostPreview[] }>({
    queryKey: ["user", "posts"],
    queryFn: async () => (await api.get("/users/me/posts?page=1")).data,
    staleTime: 1000 * 60 * 3,
  });

  if (isLoading) return <div>불러오는 중...</div>;
  if (!data?.posts?.length) return <div>게시글이 없습니다.</div>;

  return (
    <section className="mb-10">
      <h2 className="font-bold text-lg mb-3">내 게시글</h2>
      <ul className="bg-white border rounded-xl shadow divide-y">
        {data.posts.map((p) => (
          <li
            key={p.id}
            className="flex justify-between items-center px-4 py-3 transition hover:bg-yellow-50"
          >
            <span className="truncate font-medium">
              [{p.region}] {p.title}
            </span>
            <span className="text-xs text-gray-400">{p.createdAt}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
