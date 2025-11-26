import React from 'react';
import { Email } from '../types.ts';
import { SparklesIcon, EnvelopeIcon } from './icons.tsx';

interface InboxViewProps {
  emails: Email[];
  onAnalyzeEmail: (email: Email) => void;
}

const InboxView: React.FC<InboxViewProps> = ({ emails, onAnalyzeEmail }) => {
  const unprocessedEmails = emails.filter(e => !e.requestID);
  const processedEmails = emails.filter(e => e.requestID);

  return (
    <div className="bg-glass-white/70 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border border-white/20">
      <h2 className="text-2xl font-semibold text-ink-black tracking-tight mb-1">Email Triage</h2>
      <p className="text-ink-black/60 mb-6">Triage incoming emails and convert them into trackable requests.</p>
      
      {unprocessedEmails.length > 0 ? (
        <ul className="divide-y divide-black/10">
          {unprocessedEmails.map((email) => (
            <li key={email.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <EnvelopeIcon className="h-5 w-5 text-ink-black/60"/>
                    <p className="font-semibold text-ink-black">{email.subject}</p>
                </div>
                <p className="text-sm text-ink-black/70 ml-8">{email.snippet}</p>
                <p className="text-xs text-ink-black/40 mt-2 ml-8">
                  From: <strong>{email.sender}</strong> on {email.date}
                </p>
              </div>
              <button
                onClick={() => onAnalyzeEmail(email)}
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
          <h3 className="font-semibold text-lg">Email Inbox Clear!</h3>
          <p>All relevant emails have been processed.</p>
        </div>
      )}

      {processedEmails.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-ink-black mb-4">Processed Emails</h3>
            <ul className="divide-y divide-black/10 opacity-60">
                {processedEmails.map((email) => (
                    <li key={email.id} className="py-3 flex justify-between items-center gap-4">
                         <div className="flex-1">
                            <p className="font-semibold text-sm text-ink-black truncate" title={email.subject}>{email.subject}</p>
                            <p className="text-xs text-ink-black/50 mt-1">From: {email.sender}</p>
                        </div>
                        <span className="text-sm font-bold text-green whitespace-nowrap">
                            Processed as {email.requestID}
                        </span>
                    </li>
                ))}
            </ul>
          </div>
      )}
    </div>
  );
};

export default InboxView;
