// hooks/useAuth.ts
import * as api from "@/libs/api/auth/auth.api";
import { useMutation } from "@tanstack/react-query";

export function useCheckUsername() {
  return useMutation({ mutationFn: api.checkUsername });
}
export function useCheckEmail() {
  return useMutation({ mutationFn: api.checkEmail });
}
export function useSendCode() {
  return useMutation({ mutationFn: api.sendCode });
}
// hooks/useAuth.ts
export function useVerifyCode() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      api.verifyCode(email, code),
  });
}
export function useSignup() {
  return useMutation({ mutationFn: api.signup });
}