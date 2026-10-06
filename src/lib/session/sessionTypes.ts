import type { UserMode } from '../../types';

export type SessionEventType =
  | 'SESSION_STARTED'
  | 'LONG_EYE_CLOSURE'
  | 'DROWSINESS_WARNING'
  | 'DROWSINESS_DETECTED'
  | 'ALERT_ACKNOWLEDGED'
  | 'SESSION_ENDED';

export interface SessionEvent {
  id: string;
  timestamp: number;
  type: SessionEventType;
  label: string;
  durationMs?: number;
}

export interface UserSession {
  id: string;
  mode: UserMode;
  startedAt: number;
  endedAt: number | null;
  durationMs: number;
  alertCount: number;
  longEyeClosureCount: number;
  drowsinessEventCount: number;
  events: SessionEvent[];
}
