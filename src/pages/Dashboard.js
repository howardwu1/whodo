import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../App.css";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const getProjects = (projects = []) => {
    if (projects.length === 0) {
      return [
        {
          name: "My Project",
          isFavorite: false,
          isPrivate: true,
          velocity: 1,
          health: "red",
        },
      ];
    } else {
      return projects;
    }
  };

  const updateProjects = (newProjects) => {
    //placeholder
    console.log("updated state would now be ", newProjects);
    setProjects(newProjects);
  };

  useEffect(() => {
    setProjects(getProjects(projects));
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
              <div key={project.name} className="project-card">
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
                      <LockIcon
                        onClick={() =>
                          updateProjects([
                            ...projects.slice(0, index),
                            { ...project, isPrivate: !project.isPrivate },
                            ...projects.slice(index + 1, projects.length),
                          ])
                        }
                      />
                    ) : (
                      <LockOpenIcon
                        onClick={() =>
                          updateProjects([
                            ...projects.slice(0, index),
                            { ...project, isPrivate: !project.isPrivate },
                            ...projects.slice(index + 1, projects.length),
                          ])
                        }
                      />
                    )}
                    <h3 style={{ textAlign: "center" }}>{project.name}</h3>
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
                <h4>Velocity: {project.velocity}</h4>
                <h4>
                  Project Health:{" "}
                  <span style={{ color: project.health }}>
                    {project.health.toUpperCase()}
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
