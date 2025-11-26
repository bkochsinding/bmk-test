import React, { useState, useEffect } from 'react';
// Fix: Corrected import paths for root-level component.
import { BMKRequest, Status, Priority, Track, Comment, User } from './types.ts';
import { XMarkIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, PencilSquareIcon, StarIcon, ChatBubbleOvalLeftEllipsisIcon } from './components/icons.tsx';
import { TRACK_OWNERS } from './constants.ts';

interface RequestDetailDrawerProps {
  request: BMKRequest | null;
  currentUser: User;
  onClose: () => void;
  onUpdateRequest: (request: BMKRequest) => void;
  onVote: (requestId: string) => void;
  onCommentSubmit: (requestId: string, commentText: string) => void;
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

const RequestDetailDrawer: React.FC<RequestDetailDrawerProps> = ({ request, currentUser, onClose, onUpdateRequest, onVote, onCommentSubmit }) => {
  const [editedRequest, setEditedRequest] = useState<BMKRequest | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (request) {
      setEditedRequest({ ...request });
      setNewComment('');
    }
  }, [request]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editedRequest) return;
    const { name, value } = e.target;
    setEditedRequest({ ...editedRequest, [name]: value });
  };

  const handleUpdate = () => {
    if (editedRequest) {
      onUpdateRequest(editedRequest);
    }
  };
  
  const handleCommentPost = () => {
      if (newComment.trim() && request) {
          onCommentSubmit(request.id, newComment.trim());
          setNewComment("");
      }
  };

  if (!request || !editedRequest) return null;

  const trackOwnerInfo = TRACK_OWNERS[request.track];

  const getRequestSourceIcon = (req: BMKRequest) => {
    if (req.emails && req.emails.length > 0) {
        return <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-dark-text-secondary"/>;
    }
    if (req.teamsMessages && req.teamsMessages.length > 0) {
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 dark:text-dark-text-secondary"/>;
    }
    return <PencilSquareIcon className="h-5 w-5 text-gray-400 dark:text-dark-text-secondary"/>;
  };
  
  const inputClasses = "mt-1 block w-full text-base bg-gray-100/80 dark:bg-dark-bg rounded-lg border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-dark-text-secondary focus:ring-1 focus:ring-blue focus:border-blue transition";

  return (
    <>
        <div 
            className={`fixed inset-0 bg-black z-30 transition-opacity ${request ? 'bg-opacity-30' : 'bg-opacity-0 pointer-events-none'}`}
            onClick={onClose}
        ></div>
        <div className={`fixed top-0 right-0 h-full bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl shadow-2xl w-full max-w-2xl z-40 transform transition-transform duration-300 ease-in-out ${request ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
                <header className="p-6 border-b border-gray-200 dark:border-dark-border flex justify-between items-start gap-4">
                    <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                            {getRequestSourceIcon(request)}
                            <span className="font-semibold text-gray-500 dark:text-dark-text-secondary">{request.id}</span>
                        </div>
                        <input type="text" name="title" value={editedRequest.title} onChange={handleInputChange} className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary bg-transparent w-full focus:outline-none focus:ring-0 border-0 p-0 -ml-1"/>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                         <button
                          onClick={() => onVote(request.id)}
                          className="flex items-center gap-1.5 text-gray-600 dark:text-dark-text-secondary hover:text-orange-500 font-bold py-1 px-3 rounded-lg transition-colors bg-gray-100 dark:bg-dark-bg hover:bg-orange/10"
                          aria-label={`Support ${request.title}`}
                        >
                          <StarIcon className="h-5 w-5" />
                          <span className="text-base">{request.votes}</span>
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-dark-text-secondary dark:hover:text-dark-text-primary">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Status</label>
                             <div className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-dark-text-primary mt-2">
                                <div className={`w-3 h-3 rounded-full ${statusClasses[editedRequest.status]}`}></div>
                                <span>{editedRequest.status}</span>
                            </div>
                        </div>
                         <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Priority</label>
                            <div className={`mt-2 inline-block px-2.5 py-1 text-sm font-semibold rounded-full ${priorityClasses[editedRequest.priority]}`}>
                                {editedRequest.priority}
                            </div>
                        </div>
                         <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Function</label>
                            <div className={`mt-2 inline-block px-2.5 py-1 text-sm font-semibold rounded-full ${trackClasses[editedRequest.track]}`}>
                                {editedRequest.track}
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-dark-border">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary mb-1">Timeline</label>
                            <input type="date" name="timeline" value={editedRequest.timeline} onChange={handleInputChange} className={inputClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary mb-1">Stakeholder</label>
                            <input type="text" name="stakeholder" value={editedRequest.stakeholder} onChange={handleInputChange} className={inputClasses} />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary mb-1">Description</label>
                        <textarea name="description" value={editedRequest.description} onChange={handleInputChange} rows={5} className={`${inputClasses} text-base`} />
                    </div>

                    <div className="bg-gray-100/80 dark:bg-dark-bg p-4 rounded-xl border border-gray-200/80 dark:border-dark-border">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-base">
                            <div><span className="font-medium text-gray-500 dark:text-dark-text-secondary block">Owner</span> {trackOwnerInfo.owner}</div>
                            <div><span className="font-medium text-gray-500 dark:text-dark-text-secondary block">Contact</span> <a href={`mailto:${trackOwnerInfo.contact}`} className="text-blue dark:text-dark-accent hover:underline">{trackOwnerInfo.contact}</a></div>
                        </div>
                    </div>

                    <div>
                         <h3 className="font-semibold mb-3 flex items-center gap-3 text-gray-800 dark:text-dark-text-primary text-lg pt-6 border-t border-gray-200 dark:border-dark-border">
                            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-gray-400 dark:text-dark-text-secondary"/>
                            Activity & Comments
                         </h3>
                         <div className="space-y-4">
                            {request.comments && request.comments.length > 0 ? (
                                <ul className="space-y-4">
                                    {request.comments.map(comment => (
                                        <li key={comment.id} className="text-base">
                                            <div className="flex items-baseline gap-2">
                                                <p className="font-semibold text-gray-900 dark:text-dark-text-primary">{comment.author}</p>
                                                <p className="text-xs text-gray-500 dark:text-dark-text-secondary">{new Date(comment.timestamp).toLocaleString()}</p>
                                            </div>
                                            <p className="mt-1 text-gray-700 dark:text-dark-text-primary">{comment.text}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-base text-gray-500 dark:text-dark-text-secondary text-center py-4">No comments yet.</p>
                            )}
                            <div className="flex items-start gap-3 pt-4 border-t border-gray-200/80 dark:border-dark-border">
                                <textarea 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={`Comment as ${currentUser.email}...`}
                                    rows={2}
                                    className={`${inputClasses} text-base`}
                                />
                                <button
                                    onClick={handleCommentPost}
                                    className="bg-blue dark:bg-dark-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
                                >
                                    Post
                                </button>
                            </div>
                         </div>
                    </div>
                </div>

                <footer className="p-4 bg-gray-50 dark:bg-dark-bg border-t border-gray-200/80 dark:border-dark-border flex justify-end gap-3">
                    <button onClick={onClose} className="bg-white dark:bg-dark-card py-2 px-4 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm text-sm font-medium text-gray-800 dark:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-gray-700">
                        Cancel
                    </button>
                    <button onClick={handleUpdate} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue dark:bg-dark-accent hover:opacity-90">
                        Save Changes
                    </button>
                </footer>
            </div>
        </div>
    </>
  );
};

export default RequestDetailDrawer;
