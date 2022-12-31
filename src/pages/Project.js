import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../App";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const Project = () => {
  const projectID = useParams();
  const [projectDetails, setProjectDetails] = useState({});
  const { setProject } = useContext(AppContext);
  const [showMyStories, setShowMyStories] = useState(true);
  const [showCurrentIteration, setShowCurrentIteration] = useState(true);

  const getProjectDetails = (id) => {
    setProject("Sample");
    //placeholder
    return {
      id: id,
      name: "Sample",
      currentIterationStories: [
        {
          id: 123,
          title: "sample story",
          assignee: "HW",
          points: 3,
          isFinished: false,
          dateCreated: "December 27, 2022",
          type: "feature",
        },
        {
          id: 1234,
          title: "sample story 2",
          assignee: "HW",
          points: 5,
          isFinished: false,
          dateCreated: "December 28, 2022",
          type: "feature",
        },
      ],
      iceboxStories: [
        {
          id: 998,
          title: "forgotten story",
          assignee: "SR",
          points: 2,
          isFinished: false,
          dateCreated: "December 12, 2022",
          type: "feature",
        },
      ],
    };
  };

  useEffect(() => {
    setProjectDetails(getProjectDetails(projectID));
  }, []);

  return (
    <Tabs>
      <TabList className="navigation-tabs">
        <Tab>Stories</Tab>
        <Tab disabled>Analytics (Paid Feature)</Tab>
        <Tab>Members</Tab>
      </TabList>

      <TabPanel
        style={{
          display: "flex",
          height: "100%",
          overflowY: "hidden",
        }}
      >
        <>
          <div className="sidebar">
            <button
              className="sidebar-btn"
              onClick={() => {
                setShowMyStories(!showMyStories);
              }}
              style={{ color: showMyStories ? "white" : "gray" }}
            >
              My Stories
            </button>
            <button
              className="sidebar-btn"
              onClick={() => {
                setShowCurrentIteration(!showCurrentIteration);
              }}
              style={{ color: showCurrentIteration ? "white" : "gray" }}
            >
              Current Iteration
            </button>
          </div>
          <div
            style={{
              overflowY: "false",
              display: "flex",
              flexDirection: "row",
            }}
          >
            {showMyStories ? (
              <div className="stories-column">
                <h1>my stories</h1>
              </div>
            ) : null}
            {showCurrentIteration ? (
              <div className="stories-column">
                <h1>current iteration</h1>
              </div>
            ) : null}
            <div className="stories-column">
              <h1>hello</h1>
            </div>
            <div className="stories-column">
              <h1>hello</h1>
            </div>
            <div className="stories-column">
              <h1>hello</h1>
            </div>
          </div>
        </>
      </TabPanel>
      <TabPanel>
        <h2>Not yet implemented</h2>
      </TabPanel>
      <TabPanel>
        <h2>Not yet implemented</h2>
      </TabPanel>
    </Tabs>
  );
};

export default Project;
