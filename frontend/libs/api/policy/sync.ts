// libs/api/policy/syncBookmarks.ts

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const syncBookmarkedPolicies = async (userId: number, bookmarkedPolicyIds: number[]): Promise<void> => {
  await axios.post(`${API_BASE_URL}/api/policy/sync`, {
    userId,
    bookmarkedPolicyIds,
  });
};