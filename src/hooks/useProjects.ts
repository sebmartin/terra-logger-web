import { useState, useEffect } from 'react';
import type { Project, NewProject, ProjectUpdate } from '../types/project';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electron.listProjects();
      // Parse JSON fields from database
      const parsedProjects = data.map((p: any) => ({
        ...p,
        bounds: p.bounds ? (typeof p.bounds === 'string' ? JSON.parse(p.bounds) : p.bounds) : null,
        center: p.center ? (typeof p.center === 'string' ? JSON.parse(p.center) : p.center) : null,
        settings: p.settings ? (typeof p.settings === 'string' ? JSON.parse(p.settings) : p.settings) : null,
      }));
      setProjects(parsedProjects);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: NewProject): Promise<Project> => {
    try {
      const created = await window.electron.createProject(project);
      const parsed = {
        ...created,
        bounds: created.bounds ? (typeof created.bounds === 'string' ? JSON.parse(created.bounds) : created.bounds) : null,
        center: created.center ? (typeof created.center === 'string' ? JSON.parse(created.center) : created.center) : null,
        settings: created.settings ? (typeof created.settings === 'string' ? JSON.parse(created.settings) : created.settings) : null,
      };
      setProjects((prev) => [parsed, ...prev]);
      return parsed;
    } catch (err) {
      console.error('Failed to create project:', err);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: ProjectUpdate): Promise<Project> => {
    try {
      const updated = await window.electron.updateProject(id, updates);
      const parsed = {
        ...updated,
        bounds: updated.bounds ? (typeof updated.bounds === 'string' ? JSON.parse(updated.bounds) : updated.bounds) : null,
        center: updated.center ? (typeof updated.center === 'string' ? JSON.parse(updated.center) : updated.center) : null,
        settings: updated.settings ? (typeof updated.settings === 'string' ? JSON.parse(updated.settings) : updated.settings) : null,
      };
      setProjects((prev) => prev.map((p) => (p.id === id ? parsed : p)));
      return parsed;
    } catch (err) {
      console.error('Failed to update project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      await window.electron.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete project:', err);
      throw err;
    }
  };

  const getProject = async (id: string): Promise<Project | null> => {
    try {
      const project = await window.electron.getProject(id);
      if (!project) return null;

      return {
        ...project,
        bounds: project.bounds ? (typeof project.bounds === 'string' ? JSON.parse(project.bounds) : project.bounds) : null,
        center: project.center ? (typeof project.center === 'string' ? JSON.parse(project.center) : project.center) : null,
        settings: project.settings ? (typeof project.settings === 'string' ? JSON.parse(project.settings) : project.settings) : null,
      };
    } catch (err) {
      console.error('Failed to get project:', err);
      return null;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    reload: loadProjects,
  };
}
