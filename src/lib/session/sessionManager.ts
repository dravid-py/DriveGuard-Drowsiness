import type { UserMode } from '../../types';
import type { UserSession, SessionEvent, SessionEventType } from './sessionTypes';

const STORAGE_KEY = 'driveguard_sessions_v1';
const MAX_SESSIONS = 20;

let activeSession: UserSession | null = null;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

const EVENT_LABELS: Record<SessionEventType, string> = {
  SESSION_STARTED: 'Session Started',
  LONG_EYE_CLOSURE: 'Long Eye Closure Flagged',
  DROWSINESS_WARNING: 'Drowsiness Warning',
  DROWSINESS_DETECTED: 'Drowsiness Detected',
  ALERT_ACKNOWLEDGED: 'Alert Acknowledged',
  SESSION_ENDED: 'Session Ended',
};

export function startSession(mode: UserMode = 'study'): UserSession {
  // If an unended session exists, finalize it first
  if (activeSession && activeSession.endedAt === null) {
    endActiveSession();
  }

  const now = Date.now();
  const initialEvent: SessionEvent = {
    id: generateId(),
    timestamp: now,
    type: 'SESSION_STARTED',
    label: `Monitoring session initialized (${mode.toUpperCase()} MODE)`,
  };

  activeSession = {
    id: generateId(),
    mode,
    startedAt: now,
    endedAt: null,
    durationMs: 0,
    alertCount: 0,
    longEyeClosureCount: 0,
    drowsinessEventCount: 0,
    events: [initialEvent],
  };

  return activeSession;
}

export function recordSessionEvent(
  type: SessionEventType,
  customLabel?: string,
  durationMs?: number
): SessionEvent | null {
  if (!activeSession) return null;

  const now = Date.now();
  const event: SessionEvent = {
    id: generateId(),
    timestamp: now,
    type,
    label: customLabel || EVENT_LABELS[type] || type,
    durationMs,
  };

  activeSession.events.push(event);

  if (type === 'DROWSINESS_DETECTED') {
    activeSession.drowsinessEventCount += 1;
    activeSession.alertCount += 1;
  } else if (type === 'LONG_EYE_CLOSURE') {
    activeSession.longEyeClosureCount += 1;
  }

  activeSession.durationMs = now - activeSession.startedAt;
  return event;
}

export function endActiveSession(): UserSession | null {
  if (!activeSession) {
    // If no active session, return latest completed session
    return getLatestCompletedSession();
  }

  const now = Date.now();
  activeSession.endedAt = now;
  activeSession.durationMs = now - activeSession.startedAt;

  const endEvent: SessionEvent = {
    id: generateId(),
    timestamp: now,
    type: 'SESSION_ENDED',
    label: 'Session Stopped & Recorded',
  };
  activeSession.events.push(endEvent);

  const completedSession = { ...activeSession };
  activeSession = null;

  // Persist to localStorage
  saveSessionToStorage(completedSession);
  return completedSession;
}

export function getActiveSession(): UserSession | null {
  return activeSession;
}

export function getAllCompletedSessions(): UserSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const sessions = JSON.parse(raw);
    return Array.isArray(sessions) ? sessions : [];
  } catch (err) {
    console.warn('Failed to load sessions from storage:', err);
    return [];
  }
}

export function getLatestCompletedSession(): UserSession | null {
  const sessions = getAllCompletedSessions();
  return sessions.length > 0 ? sessions[0] : null;
}

function saveSessionToStorage(session: UserSession): void {
  try {
    const currentList = getAllCompletedSessions();
    // Put newest at the front, limit to MAX_SESSIONS
    const updated = [session, ...currentList.filter((s) => s.id !== session.id)].slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save session to localStorage:', err);
  }
}

export function clearSessionHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear session history:', err);
  }
}
