export enum Track {
  Finance = 'Finance',
  Tech = 'Tech',
  Logistics = 'Logistics',
  HR = 'HR',
  Marketing = 'Marketing',
}

export enum Status {
  New = 'New',
  InProgress = 'In Progress',
  Blocked = 'Blocked',
  Completed = 'Completed',
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum View {
  Dashboard = 'Dashboard',
  Progress = 'Progress',
  Calendar = 'Calendar',
  Inbox = 'Inbox',
  Teams = 'Teams',
  Emails = 'Emails',
  Settings = 'Settings',
}

export enum SortOption {
    Default = 'default',
    MostSupported = 'most-supported',
    Priority = 'priority',
}

export enum RequestSource {
    Email = 'Email',
    Teams = 'Teams',
    Manual = 'Manual',
}

export interface Comment {
    id: string;
    author: string;
    timestamp: string; // ISO 8601 format
    text: string;
}

export interface Email {
    id: string;
    sender: string;
    subject: string;
    snippet: string;
    date: string;
    body?: string;
    requestID?: string;
}

export interface TeamsMessage {
    id: string;
    sender: string;
    message: string;
    channel: string;
    timestamp: string;
    requestID?: string;
}

export interface BMKRequest {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  track: Track;
  stakeholder: string;
  corporateRef: string;
  timeline: string;
  previousTimeline?: string;

  creationDate: string;
  votes: number;
  emails?: Email[];
  teamsMessages?: TeamsMessage[];
  comments?: Comment[];
}

export interface User {
    email: string;
    functions: Track[];
}
