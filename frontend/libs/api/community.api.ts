// libs/api/community.api.ts
import axios from "axios";

export const getHotPosts = async () => {
  const { data } = await axios.get("/api/community/hot");
  return data.posts;
};
export const getWeeklyPopular = async () => {
  const { data } = await axios.get("/api/community/weekly");
  return data.posts;
};