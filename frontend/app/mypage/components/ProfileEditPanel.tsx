"use client";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { UserProfileDto, patchMyProfile } from "../../../libs/api/mypage.api";
import styles from "../MyPageLayout.module.css";

// status 매핑
export const STATUS_MAP: Record<UserProfileDto["status"], string> = {
  ACTIVE: "활동중",
  DEACTIVATED: "비활성",
  LOCKED: "잠김",
  PENDING: "대기",
};

interface ProfileEditPanelProps {
  user: UserProfileDto | null;
}

function ProfileSkeleton() {
  return (
    <section
      className={styles.mypageProfileCard + " animate-pulse"}
      aria-busy="true"
    >
      <div className={styles.mypageProfileInfo}>
        <div
          className={styles.mypageProfileNickname}
          style={{
            width: 92,
            background: "#ececec",
            borderRadius: 7,
            height: 27,
          }}
        />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={styles.mypageProfileRow}
            style={{
              width: 160,
              background: "#eee",
              borderRadius: 7,
              height: 17,
              margin: "9px 0",
            }}
          />
        ))}
      </div>
      <div
        style={{
          width: 110,
          height: 110,
          background: "#f4f4f4",
          borderRadius: "50%",
        }}
      />
    </section>
  );
}

export default function ProfileEditPanel({ user }: ProfileEditPanelProps) {
  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl ?? "");
  const [imgError, setImgError] = useState(false); // ✅ 추가: 이미지 에러 fallback 처리용
  const [success, setSuccess] = useState(false);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("로그인 정보가 올바르지 않습니다.");
      await patchMyProfile(user.id, { nickname, phone, profileImageUrl });
    },
    onSuccess: () => setSuccess(true),
    onError: () => setSuccess(false),
  });

  if (!user) return <ProfileSkeleton />;

  const statusLabel =
    user.status && STATUS_MAP[user.status as keyof typeof STATUS_MAP]
      ? STATUS_MAP[user.status as keyof typeof STATUS_MAP]
      : user.status ?? "-";

  return (
    <section className={styles.mypageProfileCard} aria-label="프로필 정보">
      <div className={styles.mypageProfileInfo}>
        <div className={styles.mypageProfileNickname} tabIndex={0}>
          <input
            className={styles.profileEditInput}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={16}
            aria-label="닉네임"
            disabled={isPending}
          />
          {success && (
            <span className={styles.profileSaveToast}>✔ 저장됨</span>
          )}
        </div>
        <div className={styles.mypageProfileRow}>
          <strong>아이디</strong>
          <span>{user.username}</span>
        </div>
        <div className={styles.mypageProfileRow}>
          <strong>이메일</strong>
          <span>{user.email}</span>
        </div>
        <div className={styles.mypageProfileRow}>
          <strong>전화번호</strong>
          <input
            className={styles.profileEditInput}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={16}
            aria-label="전화번호"
            disabled={isPending}
          />
        </div>
        <div className={styles.mypageProfileRow}>
          <strong>상태</strong>
          <span
            className={
              styles.mypageProfileStatus +
              " " +
              styles[
                user.status
                  ? `status_${user.status.toLowerCase()}`
                  : "status_unknown"
              ]
            }
          >
            {statusLabel}
          </span>
        </div>
        <div className={styles.mypageProfileRow}>
          <strong>관심지역</strong>
          <span>{user.region || "-"}</span>
        </div>
        <button
          className={styles.profileEditSaveBtn}
          onClick={() => mutate()}
          disabled={isPending}
        >
          저장
        </button>
        {error && (
          <div className={styles.profileEditError}>
            저장 실패! 다시 시도해 주세요.
          </div>
        )}
      </div>
      <Image
        src={imgError || !profileImageUrl ? "/default-profile.webp" : profileImageUrl}
        alt="프로필 이미지"
        width={110}
        height={110}
        className={styles.mypageProfileBear}
        priority
        onError={() => setImgError(true)} // ✅ 이미지 실패 시 fallback 적용
      />
    </section>
  );
}
