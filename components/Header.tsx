
import React from 'react';
import { View } from '../types.ts';
import { ChartPieIcon, TableCellsIcon, CalendarIcon, InboxIcon, UserGroupIcon, EnvelopeIcon, Cog6ToothIcon, PlusCircleIcon, BellIcon } from './icons.tsx';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onNewRequest: () => void;
  notificationCount: number;
  onToggleNotifications: () => void;
}

const NavItem: React.FC<{
  view: View;
  currentView: View;
  onClick: (view: View) => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ view, currentView, onClick, children, icon }) => (
  <button
    onClick={() => onClick(view)}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-base font-semibold transition-colors ${
      currentView === view
        ? 'bg-gray-200/80 text-gray-900'
        : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
    }`}
  >
    {icon}
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onNewRequest, notificationCount, onToggleNotifications }) => {
  return (
    <div className="w-64 bg-gray-100/80 backdrop-blur-xl border-r border-gray-200/80 p-4 flex flex-col h-screen fixed">
        <div className="flex items-center gap-2 mb-8">
            <svg className="h-8 w-8 text-blue" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            <h1 className="text-xl font-bold text-gray-900">BMK Hub</h1>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
            <NavItem view={View.Dashboard} currentView={currentView} onClick={onViewChange} icon={<TableCellsIcon className="h-5 w-5"/>}>Dashboard</NavItem>
            <NavItem view={View.Progress} currentView={currentView} onClick={onViewChange} icon={<ChartPieIcon className="h-5 w-5"/>}>Progress</NavItem>
            <NavItem view={View.Calendar} currentView={currentView} onClick={onViewChange} icon={<CalendarIcon className="h-5 w-5"/>}>Calendar</NavItem>
            <NavItem view={View.Inbox} currentView={currentView} onClick={onViewChange} icon={<InboxIcon className="h-5 w-5"/>}>Inbox</NavItem>
            <NavItem view={View.Teams} currentView={currentView} onClick={onViewChange} icon={<UserGroupIcon className="h-5 w-5"/>}>Teams</NavItem>
            <NavItem view={View.Emails} currentView={currentView} onClick={onViewChange} icon={<EnvelopeIcon className="h-5 w-5"/>}>Emails</NavItem>
        </nav>
        <div className="mt-auto">
             <button
                onClick={onNewRequest}
                className="w-full flex items-center justify-center gap-2 bg-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <PlusCircleIcon className="h-5 w-5"/>
                New Request
              </button>
            <div className="mt-4 pt-4 border-t border-gray-200/80 space-y-2">
                <button
                    onClick={onToggleNotifications}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-base font-semibold transition-colors text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
                >
                    <BellIcon className="h-5 w-5"/>
                    <span>Notifications</span>
                    {notificationCount > 0 && <span className="ml-auto bg-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{notificationCount}</span>}
                </button>
                <NavItem view={View.Settings} currentView={currentView} onClick={onViewChange} icon={<Cog6ToothIcon className="h-5 w-5"/>}>Settings</NavItem>
            </div>
        </div>
    </div>
  );
};

export default Header;
