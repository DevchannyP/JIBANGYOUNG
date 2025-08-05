import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "@/libs/api/mentor/mentor.api";

export function useCreateMentorApplication() {
  return useMutation({ 
    mutationFn: api.createMentorApplication,
  });
}

export function useMentorApplicationStatus() {
  return useQuery({
    queryKey: ["mentorApplicationStatus"],
    queryFn: api.getMentorApplicationStatus,
  });
}

export function useCheckMentorApplication() {
  return useQuery({
    queryKey: ["checkMentorApplication"],
    queryFn: api.checkMentorApplication,
  });
}