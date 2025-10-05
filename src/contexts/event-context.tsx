'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types d'événements
export type EventType = 'SESSION_STATUS_CHANGED' | 'SESSION_CREATED' | 'SESSION_DELETED' | 'QUIZ_UPDATED';

export interface AppEvent {
  type: EventType;
  payload: any;
  timestamp: number;
}

interface EventContextType {
  events: AppEvent[];
  emitEvent: (type: EventType, payload: any) => void;
  subscribe: (callback: (event: AppEvent) => void) => () => void;
  clearEvents: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [subscribers, setSubscribers] = useState<((event: AppEvent) => void)[]>([]);

  const emitEvent = useCallback((type: EventType, payload: any) => {
    const event: AppEvent = {
      type,
      payload,
      timestamp: Date.now(),
    };

    setEvents(prev => [...prev, event]);

    // Notifier tous les subscribers
    subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in event subscriber:', error);
      }
    });
  }, [subscribers]);

  const subscribe = useCallback((callback: (event: AppEvent) => void) => {
    setSubscribers(prev => [...prev, callback]);

    // Retourner une fonction de désabonnement
    return () => {
      setSubscribers(prev => prev.filter(sub => sub !== callback));
    };
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const value: EventContextType = {
    events,
    emitEvent,
    subscribe,
    clearEvents,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};