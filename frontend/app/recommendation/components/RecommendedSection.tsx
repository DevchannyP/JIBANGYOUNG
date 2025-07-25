interface Period {
  label: string;
  date: string;
  time: string;
  highlight: boolean;
}

interface RecommendedData {
  id: number;
  category: string;
  title: string;
  tags: string[];
  periods: Period[];
}

interface RecommendedSectionProps {
  data: RecommendedData[];
}

export default function RecommendedSection({ data }: RecommendedSectionProps) {
  return (
    <section className="recommended-section">
      <div className="container">
        {/* 제목 */}
        <div className="recommended-title">
          <h2>
            <span className="city-highlight">대구</span> 맞춤 추천정책입니다.
          </h2>
        </div>

        {/* 추천 카드들 */}
        <div className="recommended-grid">
          {data.map((item) => (
            <div key={item.id} className="recommended-card">
              {/* 헤더 */}
              <div className="card-header">
                <div className="category-badge">
                  <div className="category-icon"></div>
                  <span className="category-text">{item.category}</span>
                </div>
                <h3 className="card-title">{item.title}</h3>
              </div>

              {/* 내용 */}
              <div className="card-content">
                {/* 태그들 */}
                <div className="tag-list">
                  {item.tags.map((tag, tagIndex) => (
                    <div key={tagIndex} className="tag-item">{tag}</div>
                  ))}
                </div>

                {/* 기간 정보 */}
                <div className="period-list">
                  {item.periods.map((period, periodIndex) => (
                    <div key={periodIndex} className="period-item">
                      <div className="period-header">
                        <span className={`period-label ${period.highlight ? 'highlight' : ''}`}>
                          {period.label}
                        </span>
                        {period.highlight && (
                          <svg className="period-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="period-date">{period.date}</div>
                      <div className="period-time">{period.time}</div>
                    </div>
                  ))}
                </div>

                {/* 버튼 */}
                <button className="more-button">더 보기</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}