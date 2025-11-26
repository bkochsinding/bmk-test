import React, { useEffect, useRef } from 'react';
import { BMKRequest } from '../types.ts';
import { BellIcon, XMarkIcon } from './icons.tsx';

interface NotificationCenterProps {
    staleRequests: BMKRequest[];
    onClose: () => void;
    onSelectRequest: (request: BMKRequest) => void;
}

const calculateDaysPending = (creationDate: string): number => {
    const now = new Date();
    const created = new Date(creationDate);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ staleRequests, onClose, onSelectRequest }) => {
  const notificationCenterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationCenterRef.current && !notificationCenterRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={notificationCenterRef} className="absolute top-16 left-64 ml-2 bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-4 w-80 z-50 border border-gray-200/80">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold flex items-center gap-2 text-gray-900">
          <BellIcon className="h-5 w-5"/> Notifications
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <XMarkIcon className="h-5 w-5"/>
        </button>
      </div>
      {staleRequests.length > 0 ? (
        <ul className="space-y-1 max-h-96 overflow-y-auto -mr-2 pr-2">
            {staleRequests.map(req => (
                <li key={req.id}>
                    <button
                        onClick={() => onSelectRequest(req)}
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-200/60 transition-colors"
                    >
                        <p className="font-semibold text-sm text-gray-800 truncate">{req.title}</p>
                        <p className="text-xs text-orange mt-1">
                            Has been '{req.status}' for {calculateDaysPending(req.creationDate)} days.
                        </p>
                    </button>
                </li>
            ))}
        </ul>
      ) : (
        <div className="text-sm text-center text-gray-500 py-8">
            <p>No new notifications.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;