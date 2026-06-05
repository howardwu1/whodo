'use client';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '../page';

interface Project {
  id: number;
  name: string;
  isFavorite: boolean;
  isPrivate: boolean;
  velocity: number[];
  target: number[];
  health: string;
}

const defaultProjects: Project[] = [
  {
    id: 12321,
    name: 'My Project',
    isFavorite: false,
    isPrivate: true,
    velocity: [2, 1],
    target: [3, 2],
    health: 'red',
  },
];

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [projectHealth, setProjectHealth] = useState<string[]>([]);

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

  return (
    <div style={{ overflowY: 'hidden', height: '100vh' }}>
      <Navigation />
      <Tabs>
        <TabList>
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <Tab>Projects</Tab>
            <Tab disabled>Workspaces (Paid Feature)</Tab>
          </div>
        </TabList>
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
          <TabPanel>
            {projects.map((project, index) => (
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
            ))}
          </TabPanel>
          <TabPanel>
            <h2>Paid only</h2>
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
}
