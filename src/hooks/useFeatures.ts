import { useProject } from '../context/ProjectContext';
import type { NewFeature, FeatureUpdate } from '../types/feature';

export function useFeatures() {
  const { currentProject, features, addFeature, updateFeatureInList, removeFeature } = useProject();

  const createFeature = async (featureData: Omit<NewFeature, 'project_id'>) => {
    if (!currentProject) {
      throw new Error('No current project');
    }

    try {
      const created = await window.electron.createFeature(currentProject.id, {
        ...featureData,
        project_id: currentProject.id,
      });

      // Parse JSON fields
      const parsed = {
        ...created,
        geometry: typeof created.geometry === 'string' ? JSON.parse(created.geometry) : created.geometry,
        properties: created.properties ? (typeof created.properties === 'string' ? JSON.parse(created.properties) : created.properties) : null,
        style: created.style ? (typeof created.style === 'string' ? JSON.parse(created.style) : created.style) : null,
      };

      addFeature(parsed);
      return parsed;
    } catch (error) {
      console.error('Failed to create feature:', error);
      throw error;
    }
  };

  const updateFeature = async (id: string, updates: FeatureUpdate) => {
    try {
      const updated = await window.electron.updateFeature(id, updates);

      // Parse JSON fields
      const parsed = {
        ...updated,
        geometry: typeof updated.geometry === 'string' ? JSON.parse(updated.geometry) : updated.geometry,
        properties: updated.properties ? (typeof updated.properties === 'string' ? JSON.parse(updated.properties) : updated.properties) : null,
        style: updated.style ? (typeof updated.style === 'string' ? JSON.parse(updated.style) : updated.style) : null,
      };

      updateFeatureInList(id, parsed);
      return parsed;
    } catch (error) {
      console.error('Failed to update feature:', error);
      throw error;
    }
  };

  const deleteFeature = async (id: string) => {
    try {
      await window.electron.deleteFeature(id);
      removeFeature(id);
    } catch (error) {
      console.error('Failed to delete feature:', error);
      throw error;
    }
  };

  return {
    features,
    createFeature,
    updateFeature,
    deleteFeature,
  };
}
