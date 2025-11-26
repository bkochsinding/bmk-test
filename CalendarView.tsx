import React, { useState, useMemo } from 'react';
// Fix: Corrected import paths for root-level component.
import { BMKRequest, Priority, Status } from './types.ts';
import { ChevronLeftIcon, ChevronRightIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, PencilSquareIcon, ArrowUturnRightIcon, BellIcon } from './components/icons.tsx';

interface CalendarViewProps {
  requests: BMKRequest[];
  onSelectRequest: (request: BMKRequest) => void;
  staleRequestIds: Set<string>;
}

const priorityClasses: Record<Priority, string> = {
  [Priority.High]: 'bg-red',
  [Priority.Medium]: 'bg-orange',
  [Priority.Low]: 'bg-gray-400',
};

const statusClasses: Record<Status, string> = {
  [Status.Completed]: 'bg-green',
  [Status.InProgress]: 'bg-blue',
  [Status.Blocked]: 'bg-orange',
  [Status.New]: 'bg-gray-400',
};

const getRequestSourceIcon = (request: BMKRequest) => {
    if (request.emails && request.emails.length > 0) {
        return <span title="Source: Email"><EnvelopeIcon className="h-5 w-5 text-gray-400"/></span>;
    }
    if (request.teamsMessages && request.teamsMessages.length > 0) {
        return <span title="Source: Teams"><ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400"/></span>;
    }
    return <span title="Source: Manual"><PencilSquareIcon className="h-5 w-5 text-gray-400"/></span>;
};

type DayDetailModalProps = {
    day: Date;
    requests: BMKRequest[];
    postponedRequests: BMKRequest[];
    onClose: () => void;
    onSelectRequest: (request: BMKRequest) => void;
    staleRequestIds: Set<string>;
};

const DayDetailModal: React.FC<DayDetailModalProps> = ({ day, requests, postponedRequests, onClose, onSelectRequest, staleRequestIds }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-lg shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-4 text-gray-900">
                Tasks for {day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <ul className="space-y-3 max-h-96 overflow-y-auto">
                {requests.map(req => (
                     <li key={req.id}>
                        <button onClick={() => onSelectRequest(req)} className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors border border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${statusClasses[req.status]}`} title={`Status: ${req.status}`}></div>
                                {getRequestSourceIcon(req)}
                                {staleRequestIds.has(req.id) && (
                                    <span title="This task is pending"><BellIcon className="h-4 w-4 text-orange"/></span>
                                )}
                                <p className="font-semibold text-gray-800 truncate">{req.title}</p>
                            </div>
                             <p className="text-xs text-gray-500 mt-1 pl-4">By: {req.stakeholder} | Created: {req.creationDate}</p>
                        </button>
                    </li>
                ))}
                {postponedRequests.length > 0 && (
                     <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-600">Postponed From This Day</h4>
                        <ul className="space-y-2 mt-2">
                        {postponedRequests.map(req => (
                            <li key={`postponed-${req.id}`} className="opacity-60">
                                <button onClick={() => onSelectRequest(req)} className="w-full text-left p-2 rounded-md hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <ArrowUturnRightIcon className="h-4 w-4"/>
                                        <p className="font-semibold text-gray-700 truncate line-through">{req.title}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 pl-6">Moved to {req.timeline}</p>
                                </button>
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
            </ul>
        </div>
    </div>
);


const CalendarView: React.FC<CalendarViewProps> = ({ requests, onSelectRequest, staleRequestIds }) => {
  const [currentDate, setCurrentDate] = useState(new Date('2024-08-01T00:00:00'));
  const [modalState, setModalState] = useState<{day: Date, requests: BMKRequest[], postponed: BMKRequest[]} | null>(null);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, { active: BMKRequest[], postponed: BMKRequest[] }>();
    requests.forEach(req => {
      const activeDateStr = new Date(`${req.timeline}T00:00:00`).toDateString();
      if (!map.has(activeDateStr)) map.set(activeDateStr, { active: [], postponed: [] });
      map.get(activeDateStr)!.active.push(req);

      if (req.previousTimeline) {
          const postponedDateStr = new Date(`${req.previousTimeline}T00:00:00`).toDateString();
          if (!map.has(postponedDateStr)) map.set(postponedDateStr, { active: [], postponed: [] });
          map.get(postponedDateStr)!.postponed.push(req);
      }
    });
    return map;
  }, [requests]);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const today = new Date();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const renderRequestItem = (req: BMKRequest, isGhost = false) => {
    const isPending = staleRequestIds.has(req.id);
    return (
      <button
        key={isGhost ? `ghost-${req.id}` : req.id}
        onClick={() => onSelectRequest(req)}
        title={isGhost ? `Moved to ${req.timeline}` : req.title}
        className={`w-full text-left text-xs font-semibold p-1 rounded-md flex items-center gap-1.5 transition-colors ${isGhost ? 'opacity-50 hover:bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'}`}
      >
        <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${isGhost ? 'bg-gray-400' : priorityClasses[req.priority]}`}></div>
        <div className="flex-grow flex items-center gap-1 overflow-hidden text-gray-800">
            {isGhost ? <ArrowUturnRightIcon className="h-4 w-4 flex-shrink-0"/> : <div className={`w-2 h-2 rounded-full ${statusClasses[req.status]}`}></div>}
            {getRequestSourceIcon(req)}
            {isPending && !isGhost && <span title="This task is pending"><BellIcon className="h-4 w-4 text-orange flex-shrink-0"/></span>}
            <span className={`truncate ${isGhost ? 'line-through italic' : ''}`}>{req.title}</span>
        </div>
      </button>
    );
  };
  
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/80 p-4">
      <div className="flex justify-between items-center mb-4 px-2">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeftIcon className="h-6 w-6" /></button>
        <h2 className="text-xl font-semibold">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200"><ChevronRightIcon className="h-6 w-6" /></button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center py-2 bg-gray-50 text-xs font-bold text-gray-500">{d}</div>
        ))}
        {days.map((d, i) => {
          const dateStr = d.toDateString();
          const events = eventsByDate.get(dateStr);
          const activeEvents = events?.active || [];
          const postponedEvents = events?.postponed || [];
          const allEventsCount = activeEvents.length + postponedEvents.length;
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isToday = d.toDateString() === today.toDateString();

          return (
            <div key={i} className={`p-1.5 min-h-[120px] bg-white ${!isCurrentMonth ? 'bg-gray-50' : ''}`}>
              <div className={`text-sm font-semibold mb-1 ${isToday ? 'bg-blue text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                {d.getDate()}
              </div>
              <div className="space-y-1">
                {activeEvents.slice(0, 2).map(req => renderRequestItem(req))}
                {postponedEvents.slice(0, 2 - activeEvents.length).map(req => renderRequestItem(req, true))}
                {allEventsCount > 2 && (
                   <button onClick={() => setModalState({day: d, requests: activeEvents, postponed: postponedEvents})} className="text-xs font-bold text-blue hover:underline w-full text-left p-1">
                       + {allEventsCount - 2} more
                   </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
       {modalState && (
            <DayDetailModal 
                day={modalState.day}
                requests={modalState.requests}
                postponedRequests={modalState.postponed}
                onClose={() => setModalState(null)}
                onSelectRequest={(req) => {
                    setModalState(null);
                    onSelectRequest(req);
                }}
                staleRequestIds={staleRequestIds}
            />
       )}
    </div>
  );
};

export default CalendarView;
