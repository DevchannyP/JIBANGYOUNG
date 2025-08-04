import { Suspense } from "react";
import MentorActions from "./components/MentorActions";
import MentorHeader from "./components/MentorHeader";
import MentorList from "./components/MentorList";
import MentorTabs from "./components/MentorTabs";

export default function MentorPage() {
  return (
    <div>
      <MentorHeader />

      <div>
        <MentorTabs />
      </div>

      <div>
        <Suspense fallback={<div>멘토 정보를 불러오는 중...</div>}>
          <MentorList />
        </Suspense>
      </div>

      <div>
        <MentorActions />
      </div>
    </div>
  );
}
