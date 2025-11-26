import React from 'react';
// Fix: Corrected import paths for root-level component.
import { BMKRequest, Priority, Status, Track } from './types.ts';
import { StarIcon, ChevronRightIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, PencilSquareIcon } from './components/icons.tsx';

interface RequestListViewProps {
  requests: BMKRequest[];
  onSelectRequest: (request: BMKRequest) => void;
  onVote: (requestId: string) => void;
}

const trackClasses: Record<Track, string> = {
    [Track.Finance]: 'bg-orange/10 text-orange',
    [Track.Tech]: 'bg-blue/10 text-blue',
    [Track.Logistics]: 'bg-purple/10 text-purple',
    [Track.HR]: 'bg-teal/10 text-teal-600',
    [Track.Marketing]: 'bg-purple/10 text-purple-600',
};

const priorityClasses: Record<Priority, string> = {
    [Priority.High]: 'bg-red/10 text-red',
    [Priority.Medium]: 'bg-orange/10 text-orange',
    [Priority.Low]: 'bg-gray-400/10 text-gray-500',
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

const RequestListItem: React.FC<{ request: BMKRequest; onSelectRequest: (request: BMKRequest) => void; onVote: (requestId: string) => void; }> = ({ request, onSelectRequest, onVote }) => {
  const handleVoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote(request.id);
  };

  return (
    <div
      className="bg-card dark:bg-dark-card rounded-xl border border-gray-200/80 dark:border-dark-border hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center p-4 gap-4 group"
      onClick={() => onSelectRequest(request)}
    >
      {/* Main Info */}
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-1.5">
          {getRequestSourceIcon(request)}
          <span className="text-sm font-semibold text-gray-400 dark:text-dark-text-secondary">{request.id}</span>
          <h3 className="font-semibold text-base text-gray-900 dark:text-dark-text-primary leading-tight">{request.title}</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary ml-8">
          Stakeholder: <span className="font-medium text-gray-700 dark:text-dark-text-primary">{request.stakeholder}</span>
        </p>
      </div>

      {/* Tags and Status */}
      <div className="flex-shrink-0 flex items-center gap-4">
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${trackClasses[request.track]}`}>{request.track}</div>
        <div className={`px-2.5 py-1 text-xs font-semibold rounded-full ${priorityClasses[request.priority]}`}>
          {request.priority}
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-dark-text-primary w-28">
          <div className={`w-2.5 h-2.5 rounded-full ${statusClasses[request.status]}`}></div>
          <span>{request.status}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-3 ml-2">
        <button
          onClick={handleVoteClick}
          className="flex items-center gap-1.5 text-gray-500 dark:text-dark-text-secondary hover:text-orange font-bold py-1 px-2 rounded-lg transition-colors bg-gray-100 dark:bg-dark-bg hover:bg-orange/10"
          aria-label={`Support ${request.title}`}
        >
          <StarIcon className="h-4 w-4" />
          <span className="text-sm">{request.votes}</span>
        </button>
        <ChevronRightIcon className="h-6 w-6 text-gray-300 dark:text-dark-border group-hover:text-gray-500 dark:group-hover:text-dark-text-secondary transition-colors" />
      </div>
    </div>
  );
};


const RequestListView: React.FC<RequestListViewProps> = ({ requests, onSelectRequest, onVote }) => {
  if (requests.length === 0) {
    return <div className="text-center py-16 text-gray-500 dark:text-dark-text-secondary bg-card dark:bg-dark-card rounded-xl border border-gray-200/80 dark:border-dark-border">No requests match the current filters.</div>;
  }
  return (
    <div className="space-y-2.5">
      {requests.map((request) => (
        <RequestListItem
          key={request.id}
          request={request}
          onSelectRequest={onSelectRequest}
          onVote={onVote}
        />
      ))}
    </div>
  );
};

export default RequestListView;
