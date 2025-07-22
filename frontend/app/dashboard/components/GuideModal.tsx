// app/dashboard/components/GuideModal.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // shadcn/ui 기준

export default function GuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs mx-auto">
        <DialogHeader>
          <DialogTitle>👋 지방청년 대시보드 이용 Tip</DialogTitle>
        </DialogHeader>
        <ul className="text-sm leading-relaxed">
          <li>
            💛 <b>내게 맞는 정책 보러가기</b>에서 빠르게 혜택을 찾아보세요.
          </li>
          <li>
            🔥 <b>커뮤니케이션</b> 섹션에서 지역별 인기글을 둘러보세요.
          </li>
          <li>
            🏅 <b>지역 랭킹</b>은 스크롤 하단에서 슬라이드로 확인!
          </li>
        </ul>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default" size="sm">
              확인했어요
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
