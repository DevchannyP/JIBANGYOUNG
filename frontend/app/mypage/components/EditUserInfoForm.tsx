// app/mypage/components/EditUserInfoForm.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateMyProfile, UserProfileDto } from "../../../libs/api/mypage.api";
import styles from "./MyPageLayout.module.css";

interface Props {
  user: UserProfileDto;
}

export default function EditUserInfoForm({ user }: Props) {
  const [nickname, setNickname] = useState(user.nickname ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [profileImageUrl, setProfileImageUrl] = useState(
    user.profileImageUrl ?? ""
  );
  const [region, setRegion] = useState(user.region ?? "");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await updateMyProfile({ nickname, phone, profileImageUrl, region });
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["mypage", "me"] });
    },
    onError: (err: any) => {
      setSuccess(false);
      setError(err?.message || "저장 실패");
    },
  });

  return (
    <section className={styles.mypageEditFormSection}>
      <div className={styles.mypageSectionTitle}>
        프로필 수정
        <hr />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
      >
        <div className={styles.mypageFormRow}>
          <label>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={styles.mypageInput}
          />
        </div>
        <div className={styles.mypageFormRow}>
          <label>전화번호</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.mypageInput}
          />
        </div>
        <div className={styles.mypageFormRow}>
          <label>프로필 이미지 URL</label>
          <input
            type="text"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            className={styles.mypageInput}
          />
        </div>
        <div className={styles.mypageFormRow}>
          <label>관심지역</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={styles.mypageInput}
          />
        </div>
        <button
          type="submit"
          className={styles.mypageSaveBtn}
          disabled={isPending}
        >
          저장
        </button>
        {success && (
          <div className={styles.mypageSuccessMsg}>저장되었습니다.</div>
        )}
        {error && (
          <div style={{ color: "#d32f2f", marginTop: 12 }}>{error}</div>
        )}
      </form>
    </section>
  );
}
