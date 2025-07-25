'use client';
import { useState, useEffect } from 'react';

export default function PolicySurveyClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  if (!isClient) {
    return <div className="loading">Loading interactive content...</div>;
  }

  return (
    <div className="survey-section">
      <div className="container">
        <div className="survey-controls">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`slide-indicator ${currentSlide === index ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}