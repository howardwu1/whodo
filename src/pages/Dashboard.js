import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [projectHealth, setProjectHealth] = useState([]);

  const pointsGap = (projectIndex) => {
    return (
      projects[projectIndex]?.target?.reduce((sum, x) => sum + x) -
      projects[projectIndex]?.velocity?.reduce((sum, x) => sum + x)
    );
  };

  const calcProjectHealth = (projectIndex) => {
    return pointsGap(projectIndex) <=
      projects[projectIndex]?.velocity[
        projects[projectIndex]?.velocity.length - 1
      ]
      ? "green"
      : pointsGap(projectIndex) <=
        projects[projectIndex]?.velocity[
          projects[projectIndex]?.velocity.length - 1
        ] *
          1.5
      ? "yellow"
      : "red";
  };

  const getProjects = (projects = []) => {
    if (projects.length === 0) {
      return [
        {
          id: 12321,
          name: "My Project",
          isFavorite: false,
          isPrivate: true,
          velocity: [2, 1],
          target: [3, 2],
          health: "red",
        },
      ];
    } else {
      return projects;
    }
  };

  const updateProjects = (newProjects) => {
    //placeholder until backend
    console.log("updated state would now be ", newProjects);
    setProjects(newProjects);
  };

  const updatePrivate = (project, index) => {
    updateProjects([
      ...projects.slice(0, index),
      { ...project, isPrivate: !project.isPrivate },
      ...projects.slice(index + 1, projects.length),
    ]);
  };

  useEffect(() => {
    setProjects(getProjects(projects));

    setProjectHealth(projects.map((_, index) => calcProjectHealth(index)));
  }, [projects]);

  return (
    <Tabs>
      <TabList>
        <div style={{ maxWidth: "800px", margin: "auto" }}>
          <Tab>Projects</Tab>
          <Tab disabled>Workspaces (Paid Feature)</Tab>
        </div>
      </TabList>

      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <TabPanel>
          <>
            {projects.map((project, index) => (
              <div key={project.id} className="project-card">
                <div
                  style={{
                    display: "flex",
                    height: "40px",
                    alignItems: "center",
                    borderBottom: "1px solid grey",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {project.isPrivate ? (
                      <LockIcon onClick={() => updatePrivate(project, index)} />
                    ) : (
                      <LockOpenIcon
                        onClick={() => updatePrivate(project, index)}
                      />
                    )}
                    <Link to={`/projects/${project.id}`} className="hiddenLink">
                      <h3 style={{ paddingLeft: "15px" }}>{project.name}</h3>
                    </Link>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FavoriteIcon
                      style={{
                        fill: project.isFavorite ? "red" : "none",
                        stroke: "black",
                      }}
                      onClick={() =>
                        updateProjects([
                          ...projects.slice(0, index),
                          { ...project, isFavorite: !project.isFavorite },
                          ...projects.slice(index + 1, projects.length),
                        ])
                      }
                    />
                  </div>
                </div>
                <h4>
                  Velocity: {project.velocity[project.velocity.length - 1]}
                </h4>
                <h4>
                  Project Health:{" "}
                  <span style={{ color: projectHealth[index] }}>
                    {projectHealth[index]?.toUpperCase()}
                  </span>
                </h4>
              </div>
            ))}
          </>
        </TabPanel>
        <TabPanel>
          <h2>Paid only</h2>
        </TabPanel>
      </div>
    </Tabs>
  );
};

export default Dashboard;
