/* eslint-disable no-magic-numbers */
import React from 'react';

interface SparklineProps {
  data: number[];
  label: string;
}

const Sparkline: React.FC<SparklineProps> = ({ data, label }) => (
    <div className="sparkline-block">
        <span className="sparkline-block__label">{label}</span>
        {/* Здесь можно подключить библиотеку sparklines, например react-sparklines */}
        <svg width="80" height="24" className="sparkline-block__svg">
            {/* Примитивная отрисовка линии */}
            <polyline
                fill="none"
                stroke="#007aff"
                strokeWidth="2"
                points={data.map((v, i) => `${i * 10},${24 - v}`).join(' ')}
            />
        </svg>
    </div>
);

export default Sparkline;
