import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useProject } from '../../context/ProjectContext';
import './Sidebar.css';

export default function Sidebar() {
  const { projects, loading, createProject, deleteProject } = useProjects();
  const { currentProject, setCurrentProject, features } = useProject();
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const project = await createProject({
        name: newProjectName.trim(),
        description: '',
      });
      setCurrentProject(project);
      setNewProjectName('');
      setShowNewProjectDialog(false);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (confirm(`Delete project "${name}"?`)) {
      try {
        await deleteProject(id);
        if (currentProject?.id === id) {
          setCurrentProject(null);
        }
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project');
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Terra Logger</h2>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <h3>Projects</h3>
          <button
            className="btn-icon"
            onClick={() => setShowNewProjectDialog(true)}
            title="New Project"
          >
            +
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects yet</p>
            <button onClick={() => setShowNewProjectDialog(true)}>
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="project-list">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`project-item ${currentProject?.id === project.id ? 'active' : ''}`}
                onClick={() => setCurrentProject(project)}
              >
                <div className="project-info">
                  <div className="project-name">{project.name}</div>
                  <div className="project-meta">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id, project.name);
                  }}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentProject && (
        <div className="sidebar-section">
          <div className="section-header">
            <h3>Features</h3>
            <span className="count">{features.length}</span>
          </div>
          <div className="feature-list">
            {features.length === 0 ? (
              <div className="empty-state-small">
                <p>No features yet. Use the drawing tools on the map to add shapes and markers.</p>
              </div>
            ) : (
              features.map((feature) => {
                let measurement = '';
                if (feature.properties?.distance) {
                  const d = feature.properties.distance;
                  measurement = `${d.km.toFixed(2)} km`;
                } else if (feature.properties?.area) {
                  const a = feature.properties.area;
                  measurement = `${a.acres.toFixed(2)} acres`;
                }

                return (
                  <div key={feature.id} className="feature-item">
                    <div className="feature-type">{feature.type}</div>
                    <div className="feature-name">{feature.name || 'Unnamed'}</div>
                    {measurement && (
                      <div className="feature-measurement">{measurement}</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {showNewProjectDialog && (
        <div className="modal-overlay" onClick={() => setShowNewProjectDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>New Project</h3>
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={() => setShowNewProjectDialog(false)}>Cancel</button>
              <button
                className="btn-primary"
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
