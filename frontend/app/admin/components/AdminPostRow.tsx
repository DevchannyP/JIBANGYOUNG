interface AdminPostRowProps {
  post: any;
  index: number;
  searchResultLength: number;
  currentPage: number;
  ITEMS_PER_PAGE: number;
  regionOptions: any[];
  onDelete: (id: number) => void;
}

export function AdminPostRow({
  post,
  index,
  searchResultLength,
  currentPage,
  ITEMS_PER_PAGE,
  regionOptions,
  onDelete,
}: AdminPostRowProps) {
  const codePrefix = Math.floor(post.region_id / 1000) * 1000;
  const regionName =
    regionOptions.find((opt) => opt.code === post.region_id)?.name ||
    regionOptions.find((opt) => opt.code === codePrefix)?.name ||
    post.region_id;

  return (
    <tr key={post.id}>
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
        <button onClick={() => onDelete(post.id)}>삭제</button>
      </td>
    </tr>
  );
}
