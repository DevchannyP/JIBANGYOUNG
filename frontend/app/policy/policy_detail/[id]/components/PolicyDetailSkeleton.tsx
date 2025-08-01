'use client';

export default function PolicyDetailSkeleton() {
  return (
    <div className="policy-detail-container">
      {/* 상단 네비게이션 스켈레톤 */}
      <div className="top-navigation">
        <div className="back-btn skeleton">
          <div className="skeleton-text" style={{ width: '80px', height: '16px' }}></div>
        </div>
      </div>

      {/* 메인 카드 스켈레톤 */}
      <div className="policy-main-card">
        <div className="policy-header">
          <div className="policy-badges">
            <div className="skeleton-badge" style={{ width: '40px', height: '24px' }}></div>
            <div className="skeleton-badge" style={{ width: '60px', height: '24px' }}></div>
            <div className="skeleton-badge" style={{ width: '50px', height: '24px' }}></div>
          </div>
          <div className="skeleton-circle" style={{ width: '36px', height: '36px' }}></div>
        </div>

        <div className="skeleton-title" style={{ width: '300px', height: '32px', marginBottom: '24px' }}></div>

        <div className="policy-info">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="info-row">
              <div className="skeleton-circle" style={{ width: '20px', height: '20px' }}></div>
              <div className="skeleton-text" style={{ width: '60px', height: '16px' }}></div>
              <div className="info-content">
                <div className="skeleton-text" style={{ width: '200px', height: '16px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 관련 정책 스켈레톤 */}
      <div className="related-policies-section">
        <div className="skeleton-title" style={{ width: '200px', height: '24px', margin: '0 auto 40px' }}></div>
        
        <div className="policies-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="policy-card">
              <div className="skeleton-circle" style={{ width: '24px', height: '24px', position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}></div>
              <div className="skeleton-badge" style={{ width: '40px', height: '20px', position: 'absolute', top: '-10px', right: '10px' }}></div>
              <div className="skeleton-text" style={{ width: '120px', height: '20px', margin: '16px auto 12px' }}></div>
              <div className="skeleton-text" style={{ width: '100px', height: '14px', margin: '0 auto 8px' }}></div>
              <div className="skeleton-text" style={{ width: '80px', height: '14px', margin: '0 auto' }}></div>
            </div>
          ))}
        </div>
      </div>

      {/* 액션 버튼 스켈레톤 */}
      <div className="action-buttons">
        <div className="skeleton-button" style={{ width: '140px', height: '44px' }}></div>
        <div className="skeleton-button" style={{ width: '120px', height: '44px' }}></div>
        <div className="skeleton-button" style={{ width: '60px', height: '44px' }}></div>
      </div>

      <style jsx>{`
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        .skeleton-text,
        .skeleton-badge,
        .skeleton-circle,
        .skeleton-title,
        .skeleton-button {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        
        .skeleton-circle {
          border-radius: 50%;
        }
        
        .skeleton-badge {
          border-radius: 6px;
        }
        
        .skeleton-button {
          border-radius: 8px;
        }
        
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}