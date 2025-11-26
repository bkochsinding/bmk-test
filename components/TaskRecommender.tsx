import React, { useMemo, useState } from 'react';
import { BMKRequest, Status, Priority, Track } from '../types.ts';
import { LightBulbIcon, ChevronUpIcon, ChevronDownIcon } from './icons.tsx';

interface TaskRecommenderProps {
  requests: BMKRequest[];
  onSelectRequest: (request: BMKRequest) => void;
}

const calculateDaysPending = (creationDate: string): number => {
    const now = new Date();
    const created = new Date(creationDate);
    now.setHours(0, 0, 0, 0);
    created.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};


const TaskRecommender: React.FC<TaskRecommenderProps> = ({ requests, onSelectRequest }) => {
  const [activeTab, setActiveTab] = useState<'function' | 'stakeholder'>('function');
  const [isMinimized, setIsMinimized] = useState(false);

  const recommendations = useMemo(() => {
    const pendingRequests = requests.filter(r => r.status === Status.New || r.status === Status.InProgress || r.status === Status.Blocked);

    const calculateScore = (req: BMKRequest): number => {
      let score = 0;
      const daysPending = calculateDaysPending(req.creationDate);
      score += daysPending * 2;

      if (req.priority === Priority.High) score += 100;
      if (req.priority === Priority.Medium) score += 50;

      const communicationVolume = (req.emails?.length || 0) + (req.teamsMessages?.length || 0);
      score += communicationVolume * 10;
      
      score += req.votes;

      return score;
    };

    const getReasonTags = (req: BMKRequest): string[] => {
      const reasons = [];
      if (req.priority === Priority.High) reasons.push('High Priority');
      
      const daysPending = calculateDaysPending(req.creationDate);
      if (daysPending > 7) reasons.push(`Pending for ${daysPending} days`);
      
      if (req.emails && req.emails.length > 0) reasons.push(`Mentioned in ${req.emails.length} emails`);
      if (req.teamsMessages && req.teamsMessages.length > 0) reasons.push(`Active on Teams`);
      
      if (reasons.length === 0) reasons.push('New Request');

      return reasons.slice(0, 3);
    };

    // Group by Function
    const byFunction = new Map<Track, BMKRequest[]>();
    pendingRequests.forEach(req => {
        if (!byFunction.has(req.track)) byFunction.set(req.track, []);
        byFunction.get(req.track)!.push(req);
    });

    const topByFunction = Array.from(byFunction.entries())
        .map(([track, reqs]) => {
            if (reqs.length === 0) return null;
            const topRequest = reqs.reduce((max, current) => calculateScore(current) > calculateScore(max) ? current : max, reqs[0]);
            return { group: track, request: topRequest, reasons: getReasonTags(topRequest) };
        })
        .filter(Boolean) as { group: Track, request: BMKRequest, reasons: string[] }[];

    // Group by Stakeholder
    const byStakeholder = new Map<string, BMKRequest[]>();
    pendingRequests.forEach(req => {
        if (!byStakeholder.has(req.stakeholder)) byStakeholder.set(req.stakeholder, []);
        byStakeholder.get(req.stakeholder)!.push(req);
    });

    const topByStakeholder = Array.from(byStakeholder.entries())
        .map(([stakeholder, reqs]) => {
            if (reqs.length === 0) return null;
            const topRequest = reqs.reduce((max, current) => calculateScore(current) > calculateScore(max) ? current : max, reqs[0]);
            return { group: stakeholder, request: topRequest, reasons: getReasonTags(topRequest) };
        })
        .filter(Boolean) as { group: string, request: BMKRequest, reasons: string[] }[];

    return { byFunction: topByFunction, byStakeholder: topByStakeholder };

  }, [requests]);

  const activeRecommendations = activeTab === 'function' ? recommendations.byFunction : recommendations.byStakeholder;

  const TabButton: React.FC<{ tab: 'function' | 'stakeholder', children: React.ReactNode }> = ({ tab, children }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
        activeTab === tab ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-200/80 transition-all duration-300">
      <div className={`flex justify-between items-start ${isMinimized ? '' : 'mb-4'}`}>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <LightBulbIcon className="h-6 w-6 text-orange" />
          Recommended Next Task
        </h3>
        <div className="flex items-center gap-2">
            {!isMinimized && (
                 <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                    <TabButton tab="function">By Function</TabButton>
                    <TabButton tab="stakeholder">By Stakeholder</TabButton>
                </div>
            )}
             <button
                onClick={() => setIsMinimized(prev => !prev)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label={isMinimized ? 'Expand' : 'Collapse'}
            >
                {isMinimized ? <ChevronDownIcon className="h-5 w-5 text-gray-600"/> : <ChevronUpIcon className="h-5 w-5 text-gray-600"/>}
            </button>
        </div>
      </div>
      
      {!isMinimized && (
        activeRecommendations.length > 0 ? (
            <ul className="space-y-3">
            {activeRecommendations.map(({ group, request, reasons }) => (
                <li key={group} className="p-3 rounded-md border border-gray-200/80">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{group}</p>
                <p className="font-semibold text-gray-800 truncate mb-2">{request.title}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    {reasons.map(reason => (
                        <span key={reason} className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {reason}
                        </span>
                    ))}
                    </div>
                    <button
                    onClick={() => onSelectRequest(request)}
                    className="text-sm font-semibold text-blue hover:underline"
                    >
                    View Details
                    </button>
                </div>
                </li>
            ))}
            </ul>
        ) : (
            <div className="text-center py-8 text-gray-500">
            <p>No pending tasks to recommend.</p>
            </div>
        )
      )}
    </div>
  );
};

export default TaskRecommender;