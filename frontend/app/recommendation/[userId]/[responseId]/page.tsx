import RecommendationDataLoader from './RecommendationDataLoader';

interface PageProps {
  params: {
    userId: string;
    responseId: string;
  };
}

// ✅ 여기를 async function으로 변경
const Page = async ({ params }: PageProps) => {
  const userId = Number(params.userId);
  const responseId = Number(params.responseId);

  if (isNaN(userId) || isNaN(responseId)) {
    return <p>잘못된 URL입니다.</p>;
  }

  return (
    <div>
      <RecommendationDataLoader userId={userId} responseId={responseId} />
    </div>
  );
};

export default Page;