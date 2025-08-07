"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPostDetail } from "@/libs/api/community/community.api";
import PopularPosts from "../../components/PopularPosts";
import styles from "../../components/BoardList.module.css";
import EditForm from "./EditForm";

interface Props {
  regionCode: string;
  postId: string;
}

export default function EditPageClient({ regionCode, postId }: Props) {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadPostData = async () => {
      try {
        const data = await fetchPostDetail(postId);
        setPostData(data);
      } catch (err) {
        console.error("게시글 로드 실패:", err);
        setError("게시글을 불러오는데 실패했습니다.");
        alert("게시글을 불러오는데 실패했습니다.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, [postId, router]);

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            로딩 중...
          </div>
        </div>
        <aside className={styles.sidebar}>
          <PopularPosts regionCode={regionCode} />
        </aside>
      </main>
    );
  }

  if (error || !postData) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            {error || "게시글을 찾을 수 없습니다."}
          </div>
        </div>
        <aside className={styles.sidebar}>
          <PopularPosts regionCode={regionCode} />
        </aside>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <EditForm 
          regionCode={regionCode} 
          postId={postId} 
          initialData={postData} 
        />
      </div>
      <aside className={styles.sidebar}>
        <PopularPosts regionCode={regionCode} />
      </aside>
    </main>
  );
}