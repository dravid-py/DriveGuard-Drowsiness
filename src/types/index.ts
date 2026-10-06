export type UserMode = 'study' | 'work';

export type SensitivityLevel = 'low' | 'medium' | 'high';

export interface AppSettings {
  mode: UserMode;
  drowsinessSensitivity: SensitivityLevel;
  eyeClosureThreshold: number; // in seconds (e.g., 2.0s)
  alertVolume: number; // 0-100%
  alertDuration: number; // in seconds
  enableVisualAlert: boolean;
  enableAudioAlert: boolean;
  showFaceLandmarkIndicator: boolean;
  breakReminderMinutes: number; // 0 = off, 20, 30, 45, 60
}

export interface MonitoringSessionStats {
  sessionDuration: string;
  alertsCount: number;
  longEyeClosuresCount: number;
  faceStatus: 'NOT CONNECTED' | 'DETECTING' | 'CONNECTED' | 'LOST';
  eyeStatus: '--' | 'OPEN' | 'CLOSED' | 'PARTIAL';
  drowsinessStatus: 'NOT DETECTED' | 'ATTENTIVE' | 'DROWSINESS DETECTED';
}

export interface NavigationItem {
  label: string;
  path: string;
}
