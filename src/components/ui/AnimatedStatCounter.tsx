'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AnimatedStatCounterProps {
  value: string;
  label: string;
}

export default function AnimatedStatCounter({ value, label }: AnimatedStatCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue(value, setDisplayValue);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref}>
      <p
        className="text-2xl md:text-4xl font-bold text-white"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {hasAnimated ? displayValue : '0'}
      </p>
      <p className="text-xs md:text-sm text-[#a8d5bc] mt-1">{label}</p>
    </div>
  );
}

function animateValue(
  targetStr: string,
  setDisplay: (val: string) => void
) {
  // Parse the target value
  // Handle formats like "4,45,960+", "36.1%", "15 Billion"
  const cleanStr = targetStr.replace(/[+,]/g, '');

  let targetNum: number;
  let suffix = '';
  let prefix = '';
  let useIndianFormat = false;
  let decimalPlaces = 0;

  if (cleanStr.includes('Billion')) {
    targetNum = parseFloat(cleanStr);
    suffix = ' Billion';
  } else if (cleanStr.includes('%')) {
    targetNum = parseFloat(cleanStr);
    suffix = '%';
    decimalPlaces = cleanStr.includes('.') ? cleanStr.split('.')[1].replace('%', '').length : 0;
  } else {
    targetNum = parseFloat(cleanStr);
    if (targetStr.includes('+')) suffix = '+';
    if (targetStr.includes(',')) useIndianFormat = true;
  }

  const duration = 1500;
  const steps = 60;
  const stepDuration = duration / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = targetNum * eased;

    let formatted: string;
    if (decimalPlaces > 0) {
      formatted = current.toFixed(decimalPlaces);
    } else {
      formatted = Math.round(current).toString();
    }

    if (useIndianFormat) {
      formatted = formatIndianNumber(Math.round(current));
    }

    setDisplay(prefix + formatted + suffix);

    if (currentStep >= steps) {
      clearInterval(interval);
      setDisplay(targetStr); // Ensure exact final value
    }
  }, stepDuration);
}

function formatIndianNumber(num: number): string {
  const str = num.toString();
  if (str.length <= 3) return str;

  let lastThree = str.substring(str.length - 3);
  const rest = str.substring(0, str.length - 3);
  if (rest.length > 0) {
    lastThree = ',' + lastThree;
  }
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return formatted;
}
