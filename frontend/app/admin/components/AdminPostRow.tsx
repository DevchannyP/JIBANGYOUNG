import { AdminPost } from "@/types/api/adminPost";

interface AdminPostRowProps {
  post: AdminPost;
  index: number;
  searchResultLength: number;
  currentPage: number;
  ITEMS_PER_PAGE: number;
  regionOptions: any[];
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  processing: boolean;
}

export function AdminPostRow({
  post,
  index,
  searchResultLength,
  currentPage,
  ITEMS_PER_PAGE,
  regionOptions,
  onDelete,
  onRestore,
  processing,
}: AdminPostRowProps) {
  const codePrefix = Math.floor(post.region_id / 1000) * 1000;
  const regionName =
    regionOptions.find((opt) => opt.code === post.region_id)?.name ||
    regionOptions.find((opt) => opt.code === codePrefix)?.name ||
    post.region_id;

  // deleted(프론트 변수)로 버튼 UI/동작 제어
  return (
    <tr key={post.id} style={post.deleted ? { opacity: 0.6 } : {}}>
      <td>
        {searchResultLength - ((currentPage - 1) * ITEMS_PER_PAGE + index)}
      </td>
      <td>{post.title}</td>
      <td>{post.nickname}</td>
      <td>{String(post.created_at).substring(0, 10)}</td>
      <td>{post.views}</td>
      <td>{post.likes}</td>
      <td>{regionName}</td>
      <td>
        <a
          href={`/community/${Math.floor(post.region_id / 1000)}/${post.id}`}
          target="_blank"
          rel="noreferrer"
          style={{ marginLeft: "8px" }}
        >
          URL
        </a>
        {post.deleted ? (
          <button
            onClick={() => onRestore(post.id)}
            style={{
              marginLeft: "8px",
              color: "green",
              fontWeight: "bold",
            }}
            disabled={processing}
          >
            {processing ? "복구중..." : "복구"}
          </button>
        ) : (
          <button
            onClick={() => onDelete(post.id)}
            style={{ marginLeft: "8px", color: "red" }}
            disabled={processing}
          >
            {processing ? "삭제중..." : "삭제"}
          </button>
        )}
      </td>
    </tr>
  );
}
