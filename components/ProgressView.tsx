import React, { useMemo } from 'react';
import { BMKRequest, Status, Track } from '../types.ts';

interface ProgressViewProps {
  requests: BMKRequest[];
}

type TrackProgress = {
  total: number;
} & Record<Status, number>;


const statusColors: Record<Status, string> = {
  [Status.Completed]: 'bg-green',
  [Status.InProgress]: 'bg-blue',
  [Status.Blocked]: 'bg-orange',
  [Status.New]: 'bg-gray-400',
};

const ProgressView: React.FC<ProgressViewProps> = ({ requests }) => {
  const progressByTrack = useMemo(() => {
    const initialProgress: Record<Track, TrackProgress> = Object.values(Track).reduce((acc, track) => {
      acc[track] = { total: 0, [Status.Completed]: 0, [Status.InProgress]: 0, [Status.Blocked]: 0, [Status.New]: 0 };
      return acc;
    }, {} as Record<Track, TrackProgress>);
    
    return requests.reduce((acc, request) => {
      if (acc[request.track]) {
          acc[request.track].total++;
          acc[request.track][request.status]++;
      }
      return acc;
    }, initialProgress);
  }, [requests]);

  const progressByStakeholder = useMemo(() => {
    const stakeholderProgress: Record<string, TrackProgress> = {};

    requests.forEach(request => {
      const stakeholder = request.stakeholder;
      if (!stakeholderProgress[stakeholder]) {
        stakeholderProgress[stakeholder] = {
          total: 0,
          [Status.Completed]: 0,
          [Status.InProgress]: 0,
          [Status.Blocked]: 0,
          [Status.New]: 0,
        };
      }
      stakeholderProgress[stakeholder].total++;
      stakeholderProgress[stakeholder][request.status]++;
    });

    return stakeholderProgress;
  }, [requests]);

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-200/80">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Workload Snapshot by Function</h2>
        <div className="space-y-8">
          {(Object.keys(progressByTrack) as Track[]).map((track) => {
            const progress = progressByTrack[track];
            if (progress.total === 0) return null;
            return (
              <div key={track}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{track}</h3>
                  <span className="text-sm text-gray-500 font-medium">{progress.total} requests</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
                  {Object.values(Status).map(status => {
                    const percentage = progress.total > 0 ? (progress[status] / progress.total) * 100 : 0;
                    if (percentage === 0) return null;
                    return (
                      <div
                        key={status}
                        className={`${statusColors[status]} h-3 transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                        title={`${status}: ${progress[status]}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-end items-center gap-4 mt-2 text-sm">
                   {Object.values(Status).map(status => {
                      if (progress[status] === 0) return null;
                      return (
                          <div key={status} className="flex items-center gap-1.5">
                              <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`}></div>
                              <span className="text-gray-600">{status}: <strong>{progress[status]}</strong></span>
                          </div>
                      )
                   })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-200/80">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Workload Snapshot by Stakeholder</h2>
        <div className="space-y-8">
          {Object.keys(progressByStakeholder).sort().map((stakeholder) => {
            const progress = progressByStakeholder[stakeholder];
            if (progress.total === 0) return null;
            return (
              <div key={stakeholder}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{stakeholder}</h3>
                  <span className="text-sm text-gray-500 font-medium">{progress.total} requests</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
                  {Object.values(Status).map(status => {
                    const percentage = progress.total > 0 ? (progress[status] / progress.total) * 100 : 0;
                    if (percentage === 0) return null;
                    return (
                      <div
                        key={status}
                        className={`${statusColors[status]} h-3 transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                        title={`${status}: ${progress[status]}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-end items-center gap-4 mt-2 text-sm">
                   {Object.values(Status).map(status => {
                      if (progress[status] === 0) return null;
                      return (
                          <div key={status} className="flex items-center gap-1.5">
                              <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`}></div>
                              <span className="text-gray-600">{status}: <strong>{progress[status]}</strong></span>
                          </div>
                      )
                   })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;