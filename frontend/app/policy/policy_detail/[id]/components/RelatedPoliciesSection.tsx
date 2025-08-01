"use client";

import type { PolicyDetailDto } from "@/types/api/policy";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import PolicyCard from "./PolicyCard";

interface RelatedPoliciesSectionProps {
  policies: PolicyDetailDto[];
  loading: boolean;
}

export default function RelatedPoliciesSection({ 
  policies, 
  loading 
}: RelatedPoliciesSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;
  const maxSlides = Math.max(0, Math.ceil(policies.length / itemsPerSlide) - 1);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(maxSlides, prev + 1));
  };

  const getVisiblePolicies = () => {
    const start = currentSlide * itemsPerSlide;
    return policies.slice(start, start + itemsPerSlide);
  };

  if (loading) {
    return (
      <div className="related-policies-section">
        <h2 className="section-title">지금 정책과 비슷한 정책들</h2>
        <div className="policies-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="policy-card loading">
              <div className="skeleton-content"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!policies.length) {
    return null;
  }

  return (
    <div className="related-policies-section">
      <h2 className="section-title">지금 정책과 비슷한 정책들</h2>
      
      <div className="policies-slider">
        {currentSlide > 0 && (
          <button 
            className="slider-btn prev-btn" 
            onClick={handlePrevSlide}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        
        {currentSlide < maxSlides && (
          <button 
            className="slider-btn next-btn" 
            onClick={handleNextSlide}
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div className="policies-grid">
          {getVisiblePolicies().map((policy, index) => (
            <PolicyCard 
              key={policy.NO}
              policy={policy}
              cardNumber={currentSlide * itemsPerSlide + index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}