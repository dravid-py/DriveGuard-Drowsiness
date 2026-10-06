import type { AppSettings } from '../../types';

export const DEFAULT_SETTINGS: AppSettings = {
  mode: 'study',
  drowsinessSensitivity: 'medium',
  eyeClosureThreshold: 2.0,
  alertVolume: 80,
  alertDuration: 3,
  enableVisualAlert: true,
  enableAudioAlert: true,
  showFaceLandmarkIndicator: true,
  breakReminderMinutes: 45,
};

const STORAGE_KEY = 'driveguard_settings_v1';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
}

export function resetSettings(): AppSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset settings in localStorage:', err);
  }
  return DEFAULT_SETTINGS;
}
