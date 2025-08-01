import RecommendationDataLoader from './RecommendationDataLoader';

interface PageProps {
  params: Promise<{
    userId: string;
    responseId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const  userId  = Number((await params).userId);
  const  responseId  = Number((await params).responseId);


  if (isNaN(userId) || isNaN(responseId)) {
    return <p>잘못된 URL입니다.</p>;
  }

  return (
    <div>
      <RecommendationDataLoader userId={userId} responseId={responseId} />
    </div>
  );
}
