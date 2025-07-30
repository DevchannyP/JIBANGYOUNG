import RecommendationDataLoader from './RecommendationDataLoader';

interface PageProps {
  params: {
    userId: string;
    responseId: string;
  };
}

const Page = ({ params }: PageProps) => {
  const userId = Number(params.userId); // ✅ "123" → 123
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
