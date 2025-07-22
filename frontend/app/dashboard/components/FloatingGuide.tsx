"use client";
import Joyride from "react-joyride";
export default function FloatingGuide() {
  return (
    <Joyride
      steps={[
        { target: ".leftCardBox", content: "내게 맞는 정책을 찾아보세요!" },
        { target: ".sliderSection", content: "지역별 랭킹을 확인해보세요!" },
      ]}
      continuous
      showSkipButton
      showProgress
      styles={{ options: { zIndex: 9999 } }}
    />
  );
}
