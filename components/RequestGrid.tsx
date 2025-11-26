

import React from 'react';
// Fix: Add .ts extension for explicit module resolution.
import { BMKRequest } from '../types.ts';

interface RequestGridProps {
  requests: BMKRequest[];
}

const RequestGrid: React.FC<RequestGridProps> = ({ requests }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* RequestCard components would go here */}
      {requests.map(req => <div key={req.id}>{req.title}</div>)}
    </div>
  );
};

export default RequestGrid;