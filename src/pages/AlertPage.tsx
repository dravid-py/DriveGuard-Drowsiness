import React from 'react';
import { AlertOverlay } from '../components/alert/AlertOverlay';

export const AlertPage: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <AlertOverlay />
    </div>
  );
};
