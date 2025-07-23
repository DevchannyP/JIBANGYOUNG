// components/MyInfoCard.tsx
import Image from "next/image";
import { UserProfileDto } from "../../../libs/api/mypage.api";
import styles from "./MyPageLayout.module.css";

export default function MyInfoCard({ user }: { user: UserProfileDto }) {
  if (!user) return null;

  return (
    <section className={styles.mypageProfileCard}>
      <div className={styles.mypageProfileInfo}>
        <div className={styles.mypageProfileNickname}>
          {user.nickname || user.username}
        </div>
        <div className={styles.mypageProfileRow}>
          <strong>아이디</strong> {user.username}
        </div>
        <div className={styles.mypageProfileRow}>
          <strong>이메일</strong> {user.email}
        </div>
        <div className={styles.mypageProfileRow}>
          <strong>상태</strong>{" "}
          {{
            ACTIVE: "활동중",
            LOCKED: "잠김",
            DEACTIVATED: "비활성",
            PENDING: "대기",
          }[user.status] || user.status}
        </div>
        <div className={styles.mypageProfileRow}>
          <strong>관심지역</strong> {user.region || "-"}
        </div>
      </div>
      <Image
        src={user.profileImageUrl || "/public/default-profile.png"}
        alt="프로필"
        width={110}
        height={110}
        className={styles.mypageProfileBear}
        priority
      />
    </section>
  );
}
