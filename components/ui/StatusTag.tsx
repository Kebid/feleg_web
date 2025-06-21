import React from 'react';

interface StatusTagProps {
  status: 'Pending' | 'Accepted' | 'Rejected';
  className?: string;
}

export default function StatusTag({ status, className = '' }: StatusTagProps) {
  let colorClasses = '';
  switch (status) {
    case 'Accepted':
      colorClasses = 'bg-green-100 text-green-800';
      break;
    case 'Pending':
      colorClasses = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Rejected':
      colorClasses = 'bg-red-100 text-red-800';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-800';
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorClasses} ${className}`}>
      {status}
    </span>
  );
} 