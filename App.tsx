
import React, { useState, useMemo, useEffect } from 'react';
import { BMKRequest, View, Track, Priority, SortOption, Status, RequestSource, Email, TeamsMessage, User, Comment } from './types.ts';
import { MOCK_REQUESTS, MOCK_EMAILS, MOCK_TEAMS_MESSAGES, MOCK_USERS, TRACK_OWNERS } from './constants.ts';
import Header from './components/Header.tsx';
import FilterBar from './components/FilterBar.tsx';
import StatCards from './components/StatCards.tsx';
import RequestListView from './components/RequestListView.tsx';
import RequestDetailDrawer from './components/RequestDetailDrawer.tsx';
import ProgressView from './components/ProgressView.tsx';
import CalendarView from './components/CalendarView.tsx';
import InboxView from './components/InboxView.tsx';
import TeamsView from './components/TeamsView.tsx';
import EmailsView from './components/EmailsView.tsx';
import SettingsView from './components/SettingsView.tsx';
import CreateRequestModal from './components/CreateRequestModal.tsx';
import NotificationCenter from './components/NotificationCenter.tsx';
import RequestTaskModal from './components/RequestTaskModal.tsx';
import TaskRecommender from './components/TaskRecommender.tsx';

const App: React.FC = () => {
    // State
    const [requests, setRequests] = useState<BMKRequest[]>(MOCK_REQUESTS);
    const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
    const [teamsMessages, setTeamsMessages] = useState<TeamsMessage[]>(MOCK_TEAMS_MESSAGES);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [currentUserEmail, setCurrentUserEmail] = useState<string>(MOCK_USERS[0].email);

    const [currentView, setCurrentView] = useState<View>(View.Dashboard);
    const [selectedRequest, setSelectedRequest] = useState<BMKRequest | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isManualCreateModalOpen, setManualCreateModalOpen] = useState(false);
    const [initialRequestData, setInitialRequestData] = useState<Partial<BMKRequest> & { sourceItem?: Email | TeamsMessage }>({});
    const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    // Filters
    const [trackFilter, setTrackFilter] = useState<Track | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
    const [sourceFilter, setSourceFilter] = useState<RequestSource | 'all'>('all');
    const [myFunctionOnly, setMyFunctionOnly] = useState(false);
    const [sortOption, setSortOption] = useState<SortOption>(SortOption.Default);

    const currentUser = useMemo(() => users.find(u => u.email === currentUserEmail)!, [users, currentUserEmail]);

    // Derived State
    const filteredRequests = useMemo(() => {
        let filtered = [...requests];
        
        if (trackFilter !== 'all') {
            filtered = filtered.filter(req => req.track === trackFilter);
        }
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(req => req.priority === priorityFilter);
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(req => req.status === statusFilter);
        }
        if (sourceFilter !== 'all') {
            filtered = filtered.filter(req => {
                if (sourceFilter === RequestSource.Email) return req.emails && req.emails.length > 0;
                if (sourceFilter === RequestSource.Teams) return req.teamsMessages && req.teamsMessages.length > 0;
                if (sourceFilter === RequestSource.Manual) return (!req.emails || req.emails.length === 0) && (!req.teamsMessages || req.teamsMessages.length === 0);
                return false;
            });
        }
        if (myFunctionOnly) {
            filtered = filtered.filter(req => currentUser.functions.includes(req.track));
        }

        if (sortOption === SortOption.MostSupported) {
            filtered.sort((a, b) => b.votes - a.votes);
        } else if (sortOption === SortOption.Priority) {
            const priorityOrder = { [Priority.High]: 0, [Priority.Medium]: 1, [Priority.Low]: 2 };
            filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        }

        return filtered;
    }, [requests, trackFilter, priorityFilter, statusFilter, sourceFilter, myFunctionOnly, sortOption, currentUser]);

    const staleRequests = useMemo(() => {
        const now = new Date();
        return requests.filter(req => {
            if (req.status === Status.New || req.status === Status.Blocked) {
                const created = new Date(req.creationDate);
                const diffTime = Math.abs(now.getTime() - created.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays > 7;
            }
            return false;
        });
    }, [requests]);

    // Handlers
    const handleStatClick = (status: Status | 'all') => {
        setStatusFilter(status);
        setCurrentView(View.Dashboard);
    };

    const handleSelectRequest = (request: BMKRequest) => {
        setSelectedRequest(request);
        setNotificationCenterOpen(false);
    };

    const handleUpdateRequest = (updatedRequest: BMKRequest) => {
        setRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r));
        setSelectedRequest(updatedRequest);
    };

    const handleVote = (requestId: string) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, votes: r.votes + 1 } : r));
        if (selectedRequest && selectedRequest.id === requestId) {
            setSelectedRequest(prev => prev ? { ...prev, votes: prev.votes + 1 } : null);
        }
    };

    const handleCommentSubmit = (requestId: string, commentText: string) => {
        const newComment: Comment = {
            id: `c-${Date.now()}`,
            author: currentUser.email,
            timestamp: new Date().toISOString(),
            text: commentText,
        };
        const updateRequest = (req: BMKRequest) => ({
            ...req,
            comments: [...(req.comments || []), newComment],
        });
        setRequests(prev => prev.map(r => (r.id === requestId ? updateRequest(r) : r)));
        if (selectedRequest && selectedRequest.id === requestId) {
            setSelectedRequest(prev => (prev ? updateRequest(prev) : null));
        }
    };
    
    const handleUpdateUserFunctions = (email: string, functions: Track[]) => {
        setUsers(prev => prev.map(u => u.email === email ? {...u, functions} : u));
    };
    
    // Updated logic: Replaced AI analysis with direct mapping
    const handleCreateRequestFromEmail = (email: Email) => {
        const data: Partial<BMKRequest> = {
            title: email.subject,
            description: `${email.snippet}\n\n${email.body || ''}`,
            stakeholder: email.sender,
            track: Track.Tech, // Default
            priority: Priority.Medium, // Default
        };
        setInitialRequestData({ ...data, sourceItem: email });
        setCreateModalOpen(true);
    };

    const handleCreateRequestFromTeams = (message: TeamsMessage) => {
         const data: Partial<BMKRequest> = {
            title: `Request from ${message.sender}`,
            description: message.message,
            stakeholder: message.sender,
            track: Track.Tech, // Default
            priority: Priority.Medium, // Default
        };
        setInitialRequestData({ ...data, sourceItem: message });
        setCreateModalOpen(true);
    };

    const handleFinalizeRequest = (requestData: Partial<BMKRequest> & { sourceItem?: Email | TeamsMessage }) => {
        const newId = `BMK-${(requests.length + 1).toString().padStart(3, '0')}`;
        const newRequest: BMKRequest = {
            ...requestData,
            id: newId,
            status: Status.New,
            creationDate: new Date().toISOString().split('T')[0],
            votes: 1,
            timeline: requestData.timeline || new Date().toISOString().split('T')[0],
        } as BMKRequest;
        
        const newRequests = [newRequest, ...requests];
        setRequests(newRequests);

        if (requestData.sourceItem) {
            if ('sender' in requestData.sourceItem && 'subject' in requestData.sourceItem) {
                // It's an email
                setEmails(prev => prev.map(e => e.id === (requestData.sourceItem as Email).id ? { ...e, requestID: newId } : e));
            } else {
                // It's a teams message
                setTeamsMessages(prev => prev.map(m => m.id === (requestData.sourceItem as TeamsMessage).id ? { ...m, requestID: newId } : m));
            }
        }
        setCreateModalOpen(false);
    };

    const handleManualCreateRequest = (requestData: Partial<BMKRequest>) => {
        const newId = `BMK-${(requests.length + 1).toString().padStart(3, '0')}`;
        const newRequest: BMKRequest = {
            ...requestData,
            id: newId,
            status: Status.New,
            creationDate: new Date().toISOString().split('T')[0],
            votes: 1,
            timeline: requestData.timeline || new Date().toISOString().split('T')[0],
        } as BMKRequest;
        setRequests(prev => [newRequest, ...prev]);
        setManualCreateModalOpen(false);
    };

    const renderView = () => {
        switch (currentView) {
            case View.Progress: return <ProgressView requests={requests} />;
            case View.Calendar: return <CalendarView requests={requests} onSelectRequest={handleSelectRequest} staleRequestIds={new Set(staleRequests.map(r => r.id))} />;
            case View.Inbox: return <InboxView emails={emails} onCreateRequest={handleCreateRequestFromEmail} />;
            case View.Teams: return <TeamsView messages={teamsMessages} onCreateRequest={handleCreateRequestFromTeams} />;
            case View.Emails: return <EmailsView requests={requests} onSelectRequest={handleSelectRequest} />;
            case View.Settings: return <SettingsView users={users} currentUserEmail={currentUserEmail} setCurrentUserEmail={setCurrentUserEmail} onUpdateUserFunctions={handleUpdateUserFunctions} />;
            case View.Dashboard:
            default:
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                             <div>
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-dark-text-primary">Dashboard</h2>
                                <p className="mt-1 text-lg text-gray-600 dark:text-dark-text-secondary">Overview of all active and pending requests.</p>
                             </div>
                             <StatCards
                                totalRequests={requests.length}
                                inProgressCount={requests.filter(r => r.status === Status.InProgress).length}
                                blockedCount={requests.filter(r => r.status === Status.Blocked).length}
                                onStatClick={handleStatClick}
                            />
                        </div>
                        <FilterBar
                            trackFilter={trackFilter} setTrackFilter={setTrackFilter}
                            priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
                            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                            sourceFilter={sourceFilter} setSourceFilter={setSourceFilter}
                            myFunctionOnly={myFunctionOnly} setMyFunctionOnly={setMyFunctionOnly}
                            sortOption={sortOption} setSortOption={setSortOption}
                            timelineFilter={""} setTimelineFilter={() => {}}
                        />
                        <TaskRecommender requests={requests} onSelectRequest={handleSelectRequest} />
                        <RequestListView requests={filteredRequests} onSelectRequest={handleSelectRequest} onVote={handleVote} />
                    </div>
                );
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen dark:bg-dark-bg">
            <Header 
                currentView={currentView} 
                onViewChange={setCurrentView}
                onNewRequest={() => setManualCreateModalOpen(true)}
                notificationCount={staleRequests.length}
                onToggleNotifications={() => setNotificationCenterOpen(p => !p)}
                theme={theme}
                onThemeToggle={handleThemeToggle}
            />
            {isNotificationCenterOpen && (
                <NotificationCenter 
                    staleRequests={staleRequests}
                    onClose={() => setNotificationCenterOpen(false)}
                    onSelectRequest={handleSelectRequest}
                />
            )}
            <main className="pl-72 pr-8 py-8">
                {renderView()}
            </main>
            <RequestDetailDrawer
                request={selectedRequest}
                currentUser={currentUser}
                onClose={() => setSelectedRequest(null)}
                onUpdateRequest={handleUpdateRequest}
                onVote={handleVote}
                onCommentSubmit={handleCommentSubmit}
            />
            <CreateRequestModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreateRequest={handleFinalizeRequest}
                initialData={initialRequestData}
            />
            <RequestTaskModal
                isOpen={isManualCreateModalOpen}
                onClose={() => setManualCreateModalOpen(false)}
                onCreateRequest={handleManualCreateRequest}
                users={users}
                trackOwners={TRACK_OWNERS}
            />
        </div>
    );
};

export default App;
