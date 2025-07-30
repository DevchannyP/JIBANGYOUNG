import React from 'react';

interface RecommendationRegionCardProps {
  rank: number;
  regionName: string;
  regionDescription: string[];
}

const RecommendationRegionCard: React.FC<RecommendationRegionCardProps> = ({ 
  rank, 
  regionName, 
  regionDescription 
}) => {
  const rankBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    background: '#4285f4',
    color: 'white',
    borderRadius: '50%',
    fontWeight: 700,
    fontSize: '16px',
    marginBottom: '12px'
  };

  const regionNameStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 700,
    color: '#333333',
    margin: '0 0 16px 0'
  };

  const descriptionListStyle: React.CSSProperties = {
    listStyle: 'none',
    textAlign: 'left',
    padding: 0,
    margin: 0
  };

  const descriptionItemStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666666',
    marginBottom: '8px',
    paddingLeft: '16px',
    position: 'relative',
    lineHeight: 1.5
  };

  return (
    <>
      <div style={rankBadgeStyle}>{rank}</div>
      <h3 style={regionNameStyle}>{regionName}</h3>
      <ul style={descriptionListStyle}>
        {regionDescription.map((desc, idx) => (
          <li key={idx} style={descriptionItemStyle}>
            <span style={{
              position: 'absolute',
              left: 0,
              color: '#4285f4',
              fontWeight: 'bold'
            }}>•</span>
            {desc}
          </li>
        ))}
      </ul>
    </>
  );
};

export default RecommendationRegionCard;