// components/Skeleton.tsx
import React from "react";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  style?: React.CSSProperties;
  className?: string;
};

export default function Skeleton({
  width = "100%",
  height = 18,
  radius = 8,
  style,
  className = "",
}: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
