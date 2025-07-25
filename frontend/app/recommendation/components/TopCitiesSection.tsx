interface TopCityData {
  rank: number;
  city: string;
  description: string;
  items: string[];
}

interface TopCitiesSectionProps {
  data: TopCityData[];
}

export default function TopCitiesSection({ data }: TopCitiesSectionProps) {
  return (
    <section className="top-cities-section">
      <div className="container">
        {/* 제목 */}
        <div className="section-title">
          <h2>
            <span className="highlight-user">User</span> 님의{' '}
            <span className="highlight-recommend">추천지역</span>{' '}
            <span className="top3-badge">TOP3</span>
          </h2>
        </div>

        {/* 도시 카드들 */}
        <div className="cities-grid">
          {data.map((city) => (
            <div key={city.rank} className="city-card">
              {/* 순위와 도시명 */}
              <div className="city-header">
                <div className="rank-badge">{city.rank}</div>
                <h3 className="city-name">{city.city}</h3>
              </div>

              {/* 설명 */}
              <p className="city-description">{city.description}</p>

              {/* 항목들 */}
              <ul className="city-items">
                {city.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}