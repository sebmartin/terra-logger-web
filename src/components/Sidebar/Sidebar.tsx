import { useState, useEffect } from 'react';
import { useSites } from '../../hooks/useSites';
import { useProjects } from '../../hooks/useProjects';
import { useProject } from '../../context/ProjectContext';
import type { Site } from '../../types/site';
import './Sidebar.css';

export default function Sidebar() {
  const { sites, currentSite, setCurrentSite, siteProjects, loading, createSite, deleteSite } = useSites();
  const { createProject, deleteProject } = useProjects();
  const { currentProject, setCurrentProject, features } = useProject();

  const [showNewSiteDialog, setShowNewSiteDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [isDefiningBounds, setIsDefiningBounds] = useState(false);

  // When site changes, clear project selection
  useEffect(() => {
    setCurrentProject(null);
  }, [currentSite, setCurrentProject]);

  const handleCreateSite = async () => {
    if (!newSiteName.trim()) return;

    // For now, use a default bounds (US center)
    // TODO: Allow user to define bounds on map
    const defaultBounds = {
      north: 50,
      south: 25,
      east: -65,
      west: -125,
    };

    try {
      const site = await createSite({
        name: newSiteName.trim(),
        description: '',
        bounds: defaultBounds,
      });
      setCurrentSite(site);
      setNewSiteName('');
      setShowNewSiteDialog(false);
    } catch (error) {
      console.error('Failed to create site:', error);
      alert('Failed to create site');
    }
  };

  const handleDeleteSite = async (id: string, name: string) => {
    if (confirm(`Delete site "${name}" and all its projects and features?`)) {
      try {
        await deleteSite(id);
      } catch (error) {
        console.error('Failed to delete site:', error);
        alert('Failed to delete site');
      }
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !currentSite) return;

    try {
      const project = await createProject({
        site_id: currentSite.id,
        name: newProjectName.trim(),
        description: '',
        status: 'planning',
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
    if (confirm(`Delete project "${name}" and all its features?`)) {
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

      {/* Sites Section */}
      <div className="sidebar-section">
        <div className="section-header">
          <h3>Sites</h3>
          <button
            className="btn-icon"
            onClick={() => setShowNewSiteDialog(true)}
            title="New Site"
          >
            +
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading sites...</div>
        ) : sites.length === 0 ? (
          <div className="empty-state">
            <p>No sites yet</p>
            <button onClick={() => setShowNewSiteDialog(true)}>
              Create Your First Site
            </button>
          </div>
        ) : (
          <div className="site-list">
            {sites.map((site) => (
              <div
                key={site.id}
                className={`site-item ${currentSite?.id === site.id ? 'active' : ''}`}
                onClick={() => setCurrentSite(site)}
              >
                <div className="site-info">
                  <div className="site-name">{site.name}</div>
                  <div className="site-meta">
                    {new Date(site.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSite(site.id, site.name);
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

      {/* Projects Section - Only show if site is selected */}
      {currentSite && (
        <div className="sidebar-section">
          <div className="section-header">
            <h3>Projects</h3>
            <div className="header-actions">
              <span className="count">{siteProjects.length}</span>
              <button
                className="btn-icon"
                onClick={() => setShowNewProjectDialog(true)}
                title="New Project"
              >
                +
              </button>
            </div>
          </div>

          <div className="project-list">
            {siteProjects.length === 0 ? (
              <div className="empty-state-small">
                <p>No projects yet. Create a project to plan expansions or modifications.</p>
              </div>
            ) : (
              siteProjects.map((project) => (
                <div
                  key={project.id}
                  className={`project-item ${currentProject?.id === project.id ? 'active' : ''}`}
                  onClick={() => setCurrentProject(project)}
                >
                  <div className="project-info">
                    <div className="project-name">{project.name}</div>
                    <div className="project-status status-{project.status}">{project.status}</div>
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
              ))
            )}
          </div>
        </div>
      )}

      {/* Features Section */}
      {(currentSite || currentProject) && (
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

      {/* New Site Dialog */}
      {showNewSiteDialog && (
        <div className="modal-overlay" onClick={() => setShowNewSiteDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>New Site</h3>
            <input
              type="text"
              placeholder="Site name"
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateSite()}
              autoFocus
            />
            <p className="modal-hint">You can define the site bounds on the map later.</p>
            <div className="modal-actions">
              <button onClick={() => setShowNewSiteDialog(false)}>Cancel</button>
              <button
                className="btn-primary"
                onClick={handleCreateSite}
                disabled={!newSiteName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Dialog */}
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
