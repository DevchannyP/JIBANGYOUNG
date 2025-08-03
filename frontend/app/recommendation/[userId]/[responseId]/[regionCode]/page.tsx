import { Suspense } from 'react';
import RecRegionClient from './RecRegionClient'; // API 호출 컴포넌트

interface RegionDetailPageProps {
  params: Promise<{
    userId: string;
    responseId: string;
    regionCode: string;
  }>;
}

function LoadingComponent() {
  return (
    <div style={{
      padding: '60px 20px',
      textAlign: 'center',
      color: '#666',
      fontSize: '18px',
    }}>
      지역 정보를 불러오는 중입니다...
    </div>
  );
}

// 여기 true면 더미 데이터 모드, false면 실제 API 호출 모드
const USE_DUMMY_DATA = true;

export default async function RegionDetailPage({ params }: RegionDetailPageProps) {

  const userId  = Number((await params).userId);
  const responseId  = Number((await params).responseId); 
  const regionCode = Number((await params).regionCode);

  // ID 유효성 검사 (숫자일 필요 없으면 이 부분은 조정 가능)
  if (!userId || !responseId || !regionCode) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#e74c3c', fontSize: '18px' }}>
        잘못된 URL입니다.
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingComponent />}>
      <RecRegionClient userId={userId} responseId={responseId} regionCode={regionCode} />
    </Suspense>
  );
}
