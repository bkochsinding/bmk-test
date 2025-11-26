

import React from 'react';
// Fix: Add .ts extension for explicit module resolution.
import { BMKRequest } from '../types.ts';

interface RequestCardProps {
  request: BMKRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  return (
    <div className="p-4 border rounded-md bg-white">
      <h3 className="font-bold">{request.title}</h3>
      <p>{request.status}</p>
    </div>
  );
};

export default RequestCard;