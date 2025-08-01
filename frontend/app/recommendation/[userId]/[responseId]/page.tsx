import RecommendationDataLoader from './RecommendationDataLoader';

export default async function Page({
  params,
}: {
  params: { userId: string; responseId: string };
}) {
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
}
