import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({ width, height, rounded = 'rounded', className = '', style }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded} ${className}`}
      style={{ width, height, ...style }}
    />
  );
} 