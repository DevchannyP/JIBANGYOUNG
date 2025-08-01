"use client";

import { ChevronLeft } from "lucide-react";

interface PolicyHeaderProps {
  onBack: () => void;
}

export default function PolicyHeader({ onBack }: PolicyHeaderProps) {
  return (
    <div className="top-navigation">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft className="back-icon" />
        뒤로가기
      </button>
    </div>
  );
}