'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { useAppContext } from '@/lib/registry';

interface Project {
  id: number;
  name: string;
  isFavorite: boolean;
  isPrivate: boolean;
  velocity: number[];
  target: number[];
  health: string;
  userId: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { username } = useAppContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectHealth, setProjectHealth] = useState<string[]>([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && username === '') {
      router.push('/');
    }
  }, [isHydrated, username, router]);

  const pointsGap = (projectIndex: number) => {
    const proj = projects[projectIndex];
    if (!proj) return 0;
    return proj.target.reduce((sum, x) => sum + x, 0) - proj.velocity.reduce((sum, x) => sum + x, 0);
  };

  const calcProjectHealth = (projectIndex: number) => {
    const proj = projects[projectIndex];
    if (!proj) return 'green';
    const lastVelocity = proj.velocity[proj.velocity.length - 1];
    const gap = pointsGap(projectIndex);
    if (gap <= lastVelocity) return 'green';
    if (gap <= lastVelocity * 1.5) return 'yellow';
    return 'red';
  };

  const updatePrivate = (project: Project, index: number) => {
    setProjects([
      ...projects.slice(0, index),
      { ...project, isPrivate: !project.isPrivate },
      ...projects.slice(index + 1),
    ]);
  };

  const updateFavorite = (project: Project, index: number) => {
    setProjects([
      ...projects.slice(0, index),
      { ...project, isFavorite: !project.isFavorite },
      ...projects.slice(index + 1),
    ]);
  };

  useEffect(() => {
    setProjectHealth(projects.map((_, index) => calcProjectHealth(index)));
  }, [projects]);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsFetchingProjects(true);
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          // Filter projects by username (using userId which is the username for now)
          const userProjects = data.filter((p: Project) => p.userId === username);
          setProjects(userProjects);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
      setIsFetchingProjects(false);
    };
    if (username) {
      fetchProjects();
    }
  }, [username]);

  const createProject = async () => {
    if (!newProjectName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          userId: username,
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([newProject, ...projects]);
        setNewProjectName('');
        setShowNewProjectForm(false);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
    setIsLoading(false);
  };

  // Don't render anything until auth is verified
  if (!isHydrated || username === '') {
    return null;
  }

  return (
    <div style={{ overflowY: 'hidden', height: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
          <button
            onClick={() => {}}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              borderBottom: '2px solid #191970',
            }}
          >
            Projects
          </button>
          <button
            disabled
            style={{
              padding: '10px 20px',
              cursor: 'not-allowed',
              color: '#999',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Workspaces (Paid Feature)
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Your Projects</h2>
            <button
              onClick={() => setShowNewProjectForm(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#191970',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              + New Project
            </button>
          </div>

          {showNewProjectForm && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  minWidth: '300px',
                }}
              >
                <h3>Create New Project</h3>
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createProject()}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setShowNewProjectForm(false);
                      setNewProjectName('');
                    }}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createProject}
                    disabled={isLoading || !newProjectName.trim()}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: isLoading || !newProjectName.trim() ? '#ccc' : '#191970',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isLoading || !newProjectName.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isLoading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              {isFetchingProjects ? (
                <>
                  <div style={{ 
                    border: '4px solid #f3f3f3', 
                    borderTop: '4px solid #191970', 
                    borderRadius: '50%', 
                    width: '40px', 
                    height: '40px', 
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                  }} />
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                  <p>Loading projects...</p>
                </>
              ) : (
                <p>No projects yet. Create one to get started!</p>
              )}
            </div>
          ) : (
            projects.map((project, index) => (
              <div key={project.id} className="project-card">
                <div
                  style={{
                    display: 'flex',
                    height: '40px',
                    alignItems: 'center',
                    borderBottom: '1px solid grey',
                    paddingLeft: '15px',
                    paddingRight: '15px',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {project.isPrivate ? (
                      <LockIcon onClick={() => updatePrivate(project, index)} style={{ cursor: 'pointer' }} />
                    ) : (
                      <LockOpenIcon onClick={() => updatePrivate(project, index)} style={{ cursor: 'pointer' }} />
                    )}
                    <Link href={`/projects/${project.id}`} className="hiddenLink">
                      <h3 style={{ paddingLeft: '15px' }}>{project.name}</h3>
                    </Link>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FavoriteIcon
                      style={{
                        fill: project.isFavorite ? 'red' : 'none',
                        stroke: 'black',
                        cursor: 'pointer',
                      }}
                      onClick={() => updateFavorite(project, index)}
                    />
                  </div>
                </div>
                <h4>
                  Velocity: {project.velocity[project.velocity.length - 1]}
                </h4>
                <h4>
                  Project Health:{' '}
                  <span style={{ color: projectHealth[index] }}>
                    {projectHealth[index]?.toUpperCase()}
                  </span>
                </h4>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
