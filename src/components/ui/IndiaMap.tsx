'use client';

import React, { useState } from 'react';

interface CityData {
  name: string;
  count: string;
  x: number;
  y: number;
  color: string;
}

const CITIES: CityData[] = [
  { name: 'Delhi NCR', count: '1,23,400+', x: 190, y: 120, color: '#EF4444' },
  { name: 'Mumbai', count: '98,200+', x: 125, y: 250, color: '#F59E0B' },
  { name: 'Bengaluru', count: '67,500+', x: 160, y: 340, color: '#6366F1' },
  { name: 'Hyderabad', count: '45,800+', x: 170, y: 290, color: '#10B981' },
  { name: 'Chennai', count: '38,100+', x: 190, y: 360, color: '#06B6D4' },
  { name: 'Kolkata', count: '32,700+', x: 265, y: 200, color: '#EC4899' },
  { name: 'Pune', count: '28,400+', x: 130, y: 270, color: '#8B5CF6' },
  { name: 'Ahmedabad', count: '22,600+', x: 100, y: 200, color: '#F97316' },
];

export default function IndiaMap() {
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null);

  return (
    <div className="relative max-w-md mx-auto">
      <svg viewBox="0 0 360 450" className="w-full h-auto" style={{ filter: 'drop-shadow(0 4px 20px rgba(16, 185, 129, 0.1))' }}>
        {/* Simplified India outline */}
        <path
          d="M180,10 L220,20 L250,30 L270,50 L280,80 L290,100 L300,120 L310,140 L300,160 L290,180 L280,200 L270,220 L275,240 L280,260 L270,280 L260,300 L250,320 L240,340 L220,360 L200,380 L190,400 L180,410 L170,420 L160,410 L150,400 L140,380 L130,360 L120,340 L110,320 L100,300 L90,280 L85,260 L80,240 L75,220 L70,200 L65,180 L60,160 L70,140 L80,120 L90,100 L100,80 L120,60 L140,40 L160,25 L180,10Z"
          fill="rgba(16, 185, 129, 0.08)"
          stroke="rgba(16, 185, 129, 0.25)"
          strokeWidth="1.5"
        />

        {/* Grid lines for depth */}
        {[100, 150, 200, 250, 300, 350].map(y => (
          <line key={`h-${y}`} x1="60" y1={y} x2="310" y2={y} stroke="rgba(16, 185, 129, 0.04)" strokeWidth="0.5" />
        ))}
        {[100, 150, 200, 250].map(x => (
          <line key={`v-${x}`} x1={x} y1="20" x2={x} y2="420" stroke="rgba(16, 185, 129, 0.04)" strokeWidth="0.5" />
        ))}

        {/* City dots */}
        {CITIES.map(city => (
          <g
            key={city.name}
            onMouseEnter={() => setHoveredCity(city)}
            onMouseLeave={() => setHoveredCity(null)}
            className="cursor-pointer"
          >
            {/* Pulse ring */}
            <circle
              cx={city.x}
              cy={city.y}
              r="12"
              fill={city.color}
              opacity="0.15"
            >
              <animate attributeName="r" values="12;18;12" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
            </circle>
            {/* Main dot */}
            <circle
              cx={city.x}
              cy={city.y}
              r="6"
              fill={city.color}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-200"
              style={{ transform: hoveredCity?.name === city.name ? 'scale(1.3)' : 'scale(1)', transformOrigin: `${city.x}px ${city.y}px` }}
            />
            {/* City label */}
            <text
              x={city.x}
              y={city.y - 14}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="var(--color-text-secondary)"
              fontFamily="var(--font-display)"
            >
              {city.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredCity && (
        <div
          className="absolute z-10 px-4 py-3 rounded-xl shadow-lg text-center pointer-events-none animate-fade-in"
          style={{
            backgroundColor: 'var(--color-navy)',
            left: `${(hoveredCity.x / 360) * 100}%`,
            top: `${(hoveredCity.y / 450) * 100 - 12}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="text-white text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            {hoveredCity.name}
          </p>
          <p className="text-xs font-mono" style={{ color: hoveredCity.color }}>
            {hoveredCity.count} complaints
          </p>
        </div>
      )}
    </div>
  );
}
