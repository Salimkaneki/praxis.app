'use client';

import React, { ReactNode } from 'react';
import { GlobalEntityProvider } from './entities-context';
import { SessionResultProvider } from './session-result-context';
import { EventProvider } from './event-context';

// Provider global pour toute l'application
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <EventProvider>
      <GlobalEntityProvider>
        <SessionResultProvider>
          {children}
        </SessionResultProvider>
      </GlobalEntityProvider>
    </EventProvider>
  );
};