"use client";

import { useAuthStore } from "@/store/authStore";
import MentorApplyButton from "./MentorApplyButton";

export default function AuthMentorApplyButton() {
  const { user } = useAuthStore();
  const hasUserRole = user?.role === 'USER';

  if (!hasUserRole) {
    return null;
  }

  return <MentorApplyButton />;
}
