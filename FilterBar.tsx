import React from 'react';
// Fix: Corrected import paths for root-level component.
import { Track, Priority, SortOption, Status, RequestSource } from './types.ts';
import { AdjustmentsHorizontalIcon, ArrowsUpDownIcon, ChevronDownIcon } from './components/icons.tsx';

interface FilterBarProps {
  trackFilter: Track | 'all';
  setTrackFilter: (track: Track | 'all') => void;
  priorityFilter: Priority | 'all';
  setPriorityFilter: (priority: Priority | 'all') => void;
  statusFilter: Status | 'all';
  setStatusFilter: (status: Status | 'all') => void;
  sourceFilter: RequestSource | 'all';
  setSourceFilter: (source: RequestSource | 'all') => void;
  timelineFilter: string;
  setTimelineFilter: (timeline: string) => void;
  myFunctionOnly: boolean;
  setMyFunctionOnly: (value: boolean) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  trackFilter,
  setTrackFilter,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
  myFunctionOnly,
  setMyFunctionOnly,
  sortOption,
  setSortOption,
}) => {
  const selectWrapperClasses = "relative";
  const selectClasses = "appearance-none bg-transparent border-0 text-gray-900 text-sm font-medium focus:outline-none focus:ring-0 block w-full pl-3 pr-8 py-2 transition-colors";

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
      <div className="flex items-center text-gray-500 font-medium shrink-0">
        <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
        <span className="text-sm font-semibold">Filters</span>
      </div>

      {/* SEAMLESS FILTER GROUP */}
      <div className="flex items-center bg-gray-200 rounded-lg divide-x divide-gray-300 ring-1 ring-gray-300/50 focus-within:ring-2 focus-within:ring-blue">
        <div className={selectWrapperClasses}>
          <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value as Track | 'all')} className={selectClasses}>
            <option value="all">All Functions</option>
            {Object.values(Track).map((track) => (<option key={track} value={track}>{track}</option>))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>

        <div className={selectWrapperClasses}>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')} className={selectClasses}>
            <option value="all">All Priorities</option>
            {Object.values(Priority).map((priority) => (<option key={priority} value={priority}>{priority}</option>))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>

        <div className={selectWrapperClasses}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as Status | 'all')} className={selectClasses}>
            <option value="all">All Statuses</option>
            {Object.values(Status).map((status) => (<option key={status} value={status}>{status}</option>))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>

        <div className={selectWrapperClasses}>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value as RequestSource | 'all')} className={selectClasses}>
            <option value="all">All Channels</option>
            {Object.values(RequestSource).map((source) => (<option key={source} value={source}>{source}</option>))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="sm:ml-auto flex items-center gap-4">
        <div className="flex items-center">
          <input
            id="my-function-toggle"
            type="checkbox"
            checked={myFunctionOnly}
            onChange={(e) => setMyFunctionOnly(e.target.checked)}
            className="w-4 h-4 text-blue bg-gray-100 border-gray-300 rounded focus:ring-blue"
          />
          <label htmlFor="my-function-toggle" className="ml-2 text-sm font-medium text-gray-900">
            My Functions Only
          </label>
        </div>

        <div className="flex items-center text-gray-500 font-medium">
          <ArrowsUpDownIcon className="h-5 w-5 mr-1" />
          <div className="flex items-center bg-gray-200 rounded-lg ring-1 ring-gray-300/50 focus-within:ring-2 focus-within:ring-blue">
            <div className={selectWrapperClasses}>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className={`${selectClasses} py-2`}>
                <option value={SortOption.Default}>Sort By</option>
                <option value={SortOption.MostSupported}>Most Supported</option>
                <option value={SortOption.Priority}>Priority</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
