// app/policy-survey/page.tsx
import './poli_cardnews.css';
import PolicyResultClient from './policyResultClient';

// SSR로 처리할 정적 데이터 - 간소화
const getTopCitiesData = async () => {
  return [
    {
      rank: 1,
      city: '대구',
      description: '의료시설 풍부, 전문의 높은 숙련도',
      items: [
        '전문의 높은 숙련도',
        '최첨단 장비 진료',
        '진료 인프라 확충'
      ]
    },
    {
      rank: 2,
      city: '대전',
      description: '의료시설 풍부, 접근성 우수',
      items: [
        '의료진 전문성',
        '진료 장비 현대화',
        '의료 서비스 품질'
      ]
    },
    {
      rank: 3,
      city: '강릉',
      description: '의료 인프라 발달, 환경 우수',
      items: [
        '의료진 숙련도',
        '장비 투자 확대',
        '서비스 질 향상'
      ]
    }
  ];
};

const getRecommendedData = async () => {
  return [
    {
      id: 1,
      category: '지원대상',
      title: '학비지원',
      tags: ['저소득층 지원', '교육비 지원'],
      periods: [
        { label: '신청', date: '2.17~3.8', time: '온라인', highlight: false },
        { label: '결과', date: '3.18~3.22', time: '발표', highlight: true }
      ]
    },
    {
      id: 2,
      category: '지원범위',
      title: '의료지원',
      tags: ['의료비 지원', '건강관리'],
      periods: [
        { label: '신청', date: '2.17~3.8', time: '온라인', highlight: false },
        { label: '결과', date: '3.18~3.22', time: '발표', highlight: true }
      ]
    },
    {
      id: 3,
      category: '지원금액',
      title: '주거지원',
      tags: ['주택자금 지원', '임대료 지원'],
      periods: [
        { label: '신청', date: '2.17~3.8', time: '온라인', highlight: false },
        { label: '결과', date: '3.18~3.22', time: '발표', highlight: true }
      ]
    },
    {
      id: 4,
      category: '지원범위',
      title: '창업지원',
      tags: ['창업자금 지원', '사업화 지원'],
      periods: [
        { label: '신청', date: '2.17~3.8', time: '온라인', highlight: false },
        { label: '결과', date: '3.18~3.22', time: '발표', highlight: true }
      ]
    }
  ];
};
interface PageProps {
  params: {
    userId: string;
    responseId: string;
  };
}

export default function PolicyResultPage({ params }: PageProps) {
  const userId = Number(params.userId);
  const responseId = Number(params.responseId);

  return <PolicyResultClient userId={userId} responseId={responseId} />;
}
