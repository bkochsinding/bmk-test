
import React from 'react';
// Fix: Import types used in component props and logic.
import { User, Track } from '../types.ts';

// Fix: Define props interface to accept data from App.tsx.
interface SettingsViewProps {
    users: User[];
    currentUserEmail: string;
    setCurrentUserEmail: (email: string) => void;
    onUpdateUserFunctions: (email: string, functions: Track[]) => void;
}

// Fix: Implement a functional settings component instead of a placeholder.
const SettingsView: React.FC<SettingsViewProps> = ({ users, currentUserEmail, setCurrentUserEmail, onUpdateUserFunctions }) => {
    const currentUser = users.find(u => u.email === currentUserEmail);

    const handleFunctionChange = (track: Track, checked: boolean) => {
        if (!currentUser) return;
        const currentFunctions = currentUser.functions || [];
        let newFunctions: Track[];
        if (checked) {
            newFunctions = [...currentFunctions, track];
        } else {
            newFunctions = currentFunctions.filter(f => f !== track);
        }
        onUpdateUserFunctions(currentUser.email, newFunctions);
    };

    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-200/80">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Settings</h2>
            <div className="space-y-8">
                {/* User Switcher */}
                <div>
                    <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Current User
                    </label>
                    <select
                        id="user-select"
                        value={currentUserEmail}
                        onChange={(e) => setCurrentUserEmail(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue focus:border-blue sm:text-sm rounded-md"
                    >
                        {users.map(user => (
                            <option key={user.email} value={user.email}>
                                {user.email}
                            </option>
                        ))}
                    </select>
                     <p className="mt-2 text-sm text-gray-500">
                        Switch users to see how the "My Function's Requests" filter works.
                    </p>
                </div>

                {/* Function/Track Management */}
                {currentUser && (
                    <div className="pt-8 border-t border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Manage Functions for {currentUser.email}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Select the functional areas this user is responsible for.
                        </p>
                        <div className="mt-4 space-y-2">
                            {Object.values(Track).map(track => (
                                <div key={track} className="relative flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id={`track-${track}`}
                                            name={`track-${track}`}
                                            type="checkbox"
                                            checked={currentUser.functions.includes(track)}
                                            onChange={(e) => handleFunctionChange(track, e.target.checked)}
                                            className="focus:ring-blue h-4 w-4 text-blue border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor={`track-${track}`} className="font-medium text-gray-700">
                                            {track}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsView;
