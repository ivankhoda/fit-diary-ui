import React from 'react';
import './CTASection.style.scss';

interface CTASectionProps {
  primary: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
}

const CTASection: React.FC<CTASectionProps> = ({ primary, secondary }) => (
    <div className="cta-section">
        <button className="cta-section__primary" onClick={primary.onClick}>{primary.label}</button>
        {secondary && (
            <button className="cta-section__secondary" onClick={secondary.onClick}>{secondary.label}</button>
        )}
    </div>
);

export default CTASection;
