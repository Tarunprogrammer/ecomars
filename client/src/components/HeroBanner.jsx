import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HeroBanner({ onExploreClick }) {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <span className="hero-tag">
          <Sparkles size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
          New Collection 2026
        </span>
        <h1 className="hero-title">Elevate Your Everyday Essentials</h1>
        <p className="hero-subtitle">
          Discover curated tech, lifestyle, and artisan goods engineered for performance and minimalistic aesthetics.
        </p>
        <button className="btn-primary" onClick={onExploreClick} style={{ background: 'white', color: 'var(--text-main)' }}>
          <span>Explore Products</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
