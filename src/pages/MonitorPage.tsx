import React from 'react';
import { LiveMonitoringPanel } from '../components/monitoring/LiveMonitoringPanel';

export const MonitorPage: React.FC = () => {
  return (
    <div className="flex-1">
      <LiveMonitoringPanel />
    </div>
  );
};
