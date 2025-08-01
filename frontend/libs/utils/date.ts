export const formatBoardDate = (dateString: string): string => {
  const postDate = new Date(dateString);
  const today = new Date();

  // 날짜가 유효하지 않은 경우 원래 문자열 반환
  if (isNaN(postDate.getTime())) {
    return dateString;
  }

  const isToday = 
    postDate.getFullYear() === today.getFullYear() &&
    postDate.getMonth() === today.getMonth() &&
    postDate.getDate() === today.getDate();

  if (isToday) {
    // 오늘인 경우: HH:mm
    return postDate.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } else {
    // 오늘이 아닌 경우: YYYY-MM-DD
    const year = postDate.getFullYear();
    const month = String(postDate.getMonth() + 1).padStart(2, '0');
    const day = String(postDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

export const formatDetailDate = (dateString: string): string => {
  const postDate = new Date(dateString);

  // 날짜가 유효하지 않은 경우 원래 문자열 반환
  if (isNaN(postDate.getTime())) {
    return dateString;
  }

  // YYYY-MM-DD HH:mm
  const year = postDate.getFullYear();
  const month = String(postDate.getMonth() + 1).padStart(2, '0');
  const day = String(postDate.getDate()).padStart(2, '0');
  const hours = String(postDate.getHours()).padStart(2, '0');
  const minutes = String(postDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
