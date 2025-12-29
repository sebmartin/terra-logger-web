import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import type { Project } from '../types/project';
import type { Feature } from '../types/feature';

interface ProjectContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  features: Feature[];
  setFeatures: (features: Feature[]) => void;
  addFeature: (feature: Feature) => void;
  updateFeatureInList: (id: string, updates: Partial<Feature>) => void;
  removeFeature: (id: string) => void;
  selectedFeatureId: string | null;
  setSelectedFeatureId: (id: string | null) => void;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const addFeature = useCallback((feature: Feature) => {
    setFeatures((prev) => [...prev, feature]);
    setIsDirty(true);
  }, []);

  const updateFeatureInList = useCallback((id: string, updates: Partial<Feature>) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
    setIsDirty(true);
  }, []);

  const removeFeature = useCallback((id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
    setIsDirty(true);
  }, []);

  // Load features when project changes
  useEffect(() => {
    if (currentProject) {
      loadFeatures(currentProject.id);
    } else {
      setFeatures([]);
    }
  }, [currentProject]);

  const loadFeatures = async (projectId: string) => {
    try {
      const loadedFeatures = await window.electron.listFeatures(projectId);
      // Parse JSON strings from database
      const parsedFeatures = loadedFeatures.map((f: any) => ({
        ...f,
        geometry: typeof f.geometry === 'string' ? JSON.parse(f.geometry) : f.geometry,
        properties: f.properties ? (typeof f.properties === 'string' ? JSON.parse(f.properties) : f.properties) : null,
        style: f.style ? (typeof f.style === 'string' ? JSON.parse(f.style) : f.style) : null,
      }));
      setFeatures(parsedFeatures);
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to load features:', error);
    }
  };

  const value: ProjectContextType = useMemo(() => ({
    currentProject,
    setCurrentProject,
    features,
    setFeatures,
    addFeature,
    updateFeatureInList,
    removeFeature,
    selectedFeatureId,
    setSelectedFeatureId,
    isDirty,
    setIsDirty,
  }), [currentProject, features, addFeature, updateFeatureInList, removeFeature, selectedFeatureId, isDirty]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
