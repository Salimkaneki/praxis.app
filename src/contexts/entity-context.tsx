'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types génériques pour les entités
export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Hook générique pour créer un contexte d'entité
export function createEntityContext<T extends BaseEntity>(
  entityName: string,
  service: any
) {
  interface EntityContextType {
    entities: T[];
    loading: boolean;
    error: string | null;
    refreshEntities: () => Promise<void>;
    addEntity: (entity: T) => void;
    updateEntity: (id: number, updatedEntity: Partial<T>) => void;
    removeEntity: (id: number) => void;
    getEntity: (id: number) => T | undefined;
    setEntities: (entities: T[]) => void;
  }

  const EntityContext = createContext<EntityContextType | undefined>(undefined);

  const useEntityContext = () => {
    const context = useContext(EntityContext);
    if (!context) {
      throw new Error(`${entityName}Context must be used within a ${entityName}Provider`);
    }
    return context;
  };

  interface EntityProviderProps {
    children: ReactNode;
  }

  const EntityProvider: React.FC<EntityProviderProps> = ({ children }) => {
    const [entities, setEntities] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const refreshEntities = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await service.getAll();
        const data = response.data || response;

        setEntities(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error(`Erreur lors du chargement des ${entityName}:`, err);
        setError(`Impossible de récupérer les ${entityName}.`);
      } finally {
        setLoading(false);
      }
    }, [service, entityName]);

    const addEntity = useCallback((entity: T) => {
      setEntities(prev => [entity, ...prev]);
    }, []);

    const updateEntity = useCallback((id: number, updatedEntity: Partial<T>) => {
      setEntities(prev => prev.map(entity =>
        entity.id === id ? { ...entity, ...updatedEntity } : entity
      ));
    }, []);

    const removeEntity = useCallback((id: number) => {
      setEntities(prev => prev.filter(entity => entity.id !== id));
    }, []);

    const getEntity = useCallback((id: number) => {
      return entities.find(entity => entity.id === id);
    }, [entities]);

    const value: EntityContextType = {
      entities,
      loading,
      error,
      refreshEntities,
      addEntity,
      updateEntity,
      removeEntity,
      getEntity,
      setEntities,
    };

    return (
      <EntityContext.Provider value={value}>
        {children}
      </EntityContext.Provider>
    );
  };

  return {
    EntityProvider,
    useEntityContext,
    EntityContext,
  };
}