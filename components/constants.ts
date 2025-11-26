

// Fix: Corrected import path for types.
import { Track, Status, Priority, BMKRequest, Email, TeamsMessage, User } from '../types.ts';

export const TRACK_OWNERS: Record<Track, { owner: string; backup: string; contact: string }> = {
  [Track.Finance]: { owner: 'Alice', backup: 'Bob', contact: 'finance@bestseller.com' },
  [Track.Tech]: { owner: 'Charlie', backup: 'Dana', contact: 'tech@bestseller.com' },
  [Track.Logistics]: { owner: 'Eve', backup: 'Frank', contact: 'logistics@bestseller.com' },
  [Track.HR]: { owner: 'Grace', backup: 'Heidi', contact: 'hr@bestseller.com' },
  [Track.Marketing]: { owner: 'Ivan', backup: 'Judy', contact: 'marketing@bestseller.com' },
};

export const MOCK_USERS: User[] = [
    { email: 'charlie@bestseller.com', functions: [Track.Tech, Track.Logistics] },
    { email: 'alice@bestseller.com', functions: [Track.Finance] },
    { email: 'ivan@bestseller.com', functions: [Track.Marketing, Track.HR] },
];

export const MOCK_EMAILS: Email[] = [
    { id: 'email-1', sender: 'stakeholder1@example.com', subject: 'Urgent: New Feature for Q3', snippet: 'We need to discuss the new checkout feature ASAP.', date: '2024-07-20', body: 'Full body of the email about the checkout feature. It has many details.' },
    { id: 'email-2', sender: 'stakeholder2@example.com', subject: 'Follow-up on Logistics Platform', snippet: 'Any updates on the new logistics platform integration?', date: '2024-07-19', requestID: 'BMK-002'},
    { id: 'email-3', sender: 'another.person@example.com', subject: 'Marketing Campaign Budget', snippet: 'Can we get the budget for the new campaign approved?', date: '2024-07-18' },
    { id: 'email-4', sender: 'stakeholder1@example.com', subject: 'Re: Urgent: New Feature for Q3', snippet: 'Thanks for the quick reply. Let\'s schedule a meeting.', date: '2024-07-21', requestID: 'BMK-001'},
];

export const MOCK_TEAMS_MESSAGES: TeamsMessage[] = [
    { id: 'teams-1', sender: 'David P.', message: 'Hey, can we get that new report for the finance team done by EOW?', channel: 'general', timestamp: '2024-07-21 10:30 AM'},
    { id: 'teams-2', sender: 'Sarah J.', message: 'The login page is broken again on staging.', channel: 'tech-support', timestamp: '2024-07-20 02:15 PM'},
    { id: 'teams-3', sender: 'Mike R.', message: 'We need to onboard the new hires, is the HR system ready?', channel: 'hr-updates', timestamp: '2024-07-19 09:00 AM', requestID: 'BMK-004'},
    { id: 'teams-4', sender: 'David P.', message: 'Follow up on that finance report, it needs to be on the calendar for next month!', channel: 'general', timestamp: '2024-08-01 11:00 AM', requestID: 'BMK-006'}
];


export const MOCK_REQUESTS: BMKRequest[] = [
  {
    id: 'BMK-001',
    title: 'Implement New Checkout Feature',
    description: 'A comprehensive overhaul of the checkout process to improve user experience and conversion rates.',
    status: Status.InProgress,
    priority: Priority.High,
    track: Track.Tech,
    stakeholder: 'Online Sales Team',
    corporateRef: 'Jane Doe',
    timeline: '2024-08-15',
    creationDate: '2024-07-21',
    votes: 12,
    emails: [MOCK_EMAILS[0], MOCK_EMAILS[3]],
    comments: [
        // Fix: Standardize timestamp format to ISO 8601 for reliable parsing.
        { id: 'c1-1', author: 'charlie@bestseller.com', timestamp: '2024-07-22T09:15:00Z', text: 'Team is on it. First mockups should be ready by tomorrow.' },
        // Fix: Standardize timestamp format to ISO 8601 for reliable parsing.
        { id: 'c1-2', author: 'stakeholder1@example.com', timestamp: '2024-07-22T10:00:00Z', text: 'Great, looking forward to seeing them!' },
    ]
  },
  {
    id: 'BMK-002',
    title: 'Logistics Platform Integration',
    description: 'Integrate with the new third-party logistics provider to streamline shipping.',
    status: Status.Blocked,
    priority: Priority.High,
    track: Track.Logistics,
    stakeholder: 'Warehouse Ops',
    corporateRef: 'John Smith',
    timeline: '2024-09-05',
    creationDate: '2024-07-10',
    votes: 5,
    emails: [MOCK_EMAILS[1]],
    comments: [
        // Fix: Standardize timestamp format to ISO 8601 for reliable parsing.
        { id: 'c2-1', author: 'Eve@bestseller.com', timestamp: '2024-07-15T14:00:00Z', text: 'We are currently blocked waiting for API credentials from the vendor.' },
    ]
  },
  {
    id: 'BMK-003',
    title: 'Q3 Marketing Campaign Assets',
    description: 'Create and deliver all digital assets for the upcoming Q3 marketing campaign.',
    status: Status.New,
    priority: Priority.Medium,
    track: Track.Marketing,
    stakeholder: 'Marketing Dept',
    corporateRef: 'Emily White',
    timeline: '2024-08-22',
    previousTimeline: '2024-08-10',
    creationDate: '2024-07-18',
    votes: 8,
  },
  {
    id: 'BMK-004',
    title: 'HR System Update for New Hires',
    description: 'Update the HR system to accommodate the new onboarding process for summer hires.',
    status: Status.Completed,
    priority: Priority.Low,
    track: Track.HR,
    stakeholder: 'Human Resources',
    corporateRef: 'Chris Green',
    timeline: '2024-07-30',
    creationDate: '2024-07-19',
    votes: 2,
    teamsMessages: [MOCK_TEAMS_MESSAGES[2]],
  },
  {
      id: 'BMK-005',
      title: 'Annual Financial Report Automation',
      description: 'Automate the generation of the annual financial report from the new accounting software.',
      status: Status.New,
      priority: Priority.Medium,
      track: Track.Finance,
      stakeholder: 'Finance Department',
      corporateRef: 'Patricia Brown',
      timeline: '2024-08-22',
      creationDate: '2024-07-25',
      votes: 21,
  },
  {
    id: 'BMK-006',
    title: 'New Finance Report for EOW',
    description: 'Generate a new report for the finance team by the end of the week, as requested in Teams.',
    status: Status.InProgress,
    priority: Priority.Medium,
    track: Track.Finance,
    stakeholder: 'David P.',
    corporateRef: 'Alice',
    timeline: '2024-08-22',
    creationDate: '2024-08-01',
    votes: 3,
    teamsMessages: [MOCK_TEAMS_MESSAGES[0], MOCK_TEAMS_MESSAGES[3]]
  },
  {
    id: 'BMK-007',
    title: 'Fix Staging Login Page',
    description: 'The login page on the staging environment is broken and needs immediate attention.',
    status: Status.New,
    priority: Priority.High,
    track: Track.Tech,
    stakeholder: 'Sarah J.',
    corporateRef: 'Charlie',
    timeline: '2024-08-23',
    creationDate: '2024-07-15',
    votes: 9,
    teamsMessages: [MOCK_TEAMS_MESSAGES[1]]
  }
];