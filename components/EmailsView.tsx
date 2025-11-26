
import React, { useMemo } from 'react';
// Fix: Add .ts extension for explicit module resolution.
import { BMKRequest } from '../types.ts';

interface EmailsViewProps {
  requests: BMKRequest[];
  onSelectRequest: (request: BMKRequest) => void;
}

const EmailsView: React.FC<EmailsViewProps> = ({ requests, onSelectRequest }) => {
  const allEmails = useMemo(() => {
    return requests
      .flatMap(req => (req.emails || []).map(email => ({ ...email, request: req })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [requests]);

  return (
    <div className="bg-glass-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20">
      <h2 className="text-2xl font-semibold text-ink-black tracking-tight mb-6">All Logged Emails</h2>
      {allEmails.length > 0 ? (
        <ul className="divide-y divide-black/10">
          {allEmails.map(({ id, sender, subject, snippet, date, request }) => (
            <li key={id} className="py-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-ink-black">{subject}</p>
                  <p className="text-sm text-ink-black/60 mt-1">{snippet}</p>
                  <p className="text-xs text-ink-black/40 mt-2">
                    From: <strong>{sender}</strong> on {date}
                  </p>
                </div>
                <button
                  onClick={() => onSelectRequest(request)}
                  className="flex-shrink-0 whitespace-nowrap bg-black/5 hover:bg-black/10 text-ink-black/80 text-sm font-semibold py-2 px-3 rounded-xl transition-colors"
                >
                  View Request ({request.id})
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 text-ink-black/60">
          No emails have been logged for any requests.
        </div>
      )}
    </div>
  );
};

export default EmailsView;