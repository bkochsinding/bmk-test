
import React from 'react';
// Fix: Add .ts extension for explicit module resolution.
import { TeamsMessage } from '../types.ts';
// Fix: Add .tsx extension for explicit module resolution.
import { SparklesIcon, ChatBubbleLeftRightIcon } from './icons.tsx';

interface TeamsViewProps {
  messages: TeamsMessage[];
  onAnalyzeMessage: (message: TeamsMessage) => void;
}

const TeamsView: React.FC<TeamsViewProps> = ({ messages, onAnalyzeMessage }) => {
  const unprocessedMessages = messages.filter(m => !m.requestID);
  const processedMessages = messages.filter(m => m.requestID);

  return (
    <div className="bg-glass-white/70 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border border-white/20">
      <h2 className="text-2xl font-semibold text-ink-black tracking-tight mb-1">Teams Triage</h2>
      <p className="text-ink-black/60 mb-6">Triage informal requests from Microsoft Teams and convert them into trackable items.</p>
      
      {unprocessedMessages.length > 0 ? (
        <ul className="divide-y divide-black/10">
          {unprocessedMessages.map((message) => (
            <li key={message.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-ink-black/60"/>
                    <p className="font-semibold text-ink-black">{message.message}</p>
                </div>
                <p className="text-xs text-ink-black/40 ml-8">
                  From: <strong>{message.sender}</strong> in #{message.channel} at {message.timestamp}
                </p>
              </div>
              {/* Fix: Replaced non-standard color 'bg-azure-glow' with 'bg-blue' for consistency. */}
              <button
                onClick={() => onAnalyzeMessage(message)}
                className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 bg-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-colors"
              >
                <SparklesIcon className="h-5 w-5"/>
                Analyze & Create Request
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 text-ink-black/60 border-2 border-dashed border-black/10 rounded-xl">
          <h3 className="font-semibold text-lg">Teams Inbox Clear!</h3>
          <p>All relevant Teams messages have been processed.</p>
        </div>
      )}

      {processedMessages.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-ink-black mb-4">Processed Messages</h3>
            <ul className="divide-y divide-black/10 opacity-60">
                {processedMessages.map((message) => (
                    <li key={message.id} className="py-3 flex justify-between items-center gap-4">
                         <div className="flex-1">
                            <p className="font-semibold text-sm text-ink-black truncate" title={message.message}>"{message.message}"</p>
                            <p className="text-xs text-ink-black/50 mt-1">From: {message.sender} in #{message.channel}</p>
                        </div>
                        {/* Fix: Replaced non-standard color 'text-emerald-mist' with 'text-green' for consistency. */}
                        <span className="text-sm font-bold text-green whitespace-nowrap">
                            Processed as {message.requestID}
                        </span>
                    </li>
                ))}
            </ul>
          </div>
      )}
    </div>
  );
};

export default TeamsView;