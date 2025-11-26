import React from 'react';
import { Status } from '../types.ts';

interface StatCardProps {
  label: string;
  value: number;
  onClick: () => void;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`text-left p-2.5 rounded-lg min-w-[100px] transition-colors hover:bg-gray-200/60 ${className}`}
  >
    <span className="block text-2xl font-bold">{value}</span>
    <span className="block text-sm font-semibold opacity-80">{label}</span>
  </button>
);


interface StatCardsProps {
    totalRequests: number;
    inProgressCount: number;
    blockedCount: number;
    onStatClick: (status: Status | 'all') => void;
}

const StatCards: React.FC<StatCardsProps> = ({ totalRequests, inProgressCount, blockedCount, onStatClick }) => {
    return (
        <div className="flex items-center gap-1">
             <StatCard 
                label="Total" 
                value={totalRequests} 
                onClick={() => onStatClick('all')}
                className="text-gray-700"
            />
            <StatCard 
                label="In Progress" 
                value={inProgressCount} 
                onClick={() => onStatClick(Status.InProgress)}
                className="text-blue"
            />
            <StatCard 
                label="Blocked" 
                value={blockedCount} 
                onClick={() => onStatClick(Status.Blocked)}
                className="text-orange"
            />
        </div>
    );
};

export default StatCards;