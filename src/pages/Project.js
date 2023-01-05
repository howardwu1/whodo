import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../App";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const Project = () => {
  const { projectId } = useParams();
  const [projectDetails, setProjectDetails] = useState({});
  const { setProject } = useContext(AppContext);
  const [showMyStories, setShowMyStories] = useState(true);
  const [showCurrentIteration, setShowCurrentIteration] = useState(true);
  const [showMyCol, setShowMyCol] = useState(true);
  const [showMyCol2, setShowMyCol2] = useState(true);
  const numColumns =
    showCurrentIteration + showMyStories + showMyCol + showMyCol2;

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

  const [currentIterationStories, setCurrentIterationStories] = useState([]);

  const handleDrop = (droppedItem, setItemList) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...itemList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setItemList(updatedList);
  };

  useEffect(() => {
    setProjectDetails(getProjectDetails(projectId));
    setCurrentIterationStories(
      getProjectDetails(projectId).currentIterationStories
    );
  }, []);

  if (currentIterationStories !== undefined) {
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
            overflow: "hidden",
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
              <button
                className="sidebar-btn"
                onClick={() => {
                  setShowMyCol(!showMyCol);
                }}
                style={{ color: showMyCol ? "white" : "gray" }}
              >
                MyCol1
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  setShowMyCol2(!showMyCol2);
                }}
                style={{ color: showMyCol2 ? "white" : "gray" }}
              >
                MyCol2
              </button>
            </div>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                overflowY: "hidden",
                height: "91vh",
                width: "100%",
                justifyContent: numColumns < 3 ? "space-evenly" : null,
              }}
            >
              {showMyStories ? (
                <div
                  className="stories-column"
                  style={{
                    marginRight: numColumns < 3 ? null : "2px",
                    marginLeft: numColumns < 3 ? null : "2px",
                    minWidth:
                      numColumns < 3 ? 80 / numColumns - 1 + "vw" : "30vw",
                    flexFlow: "column",
                  }}
                >
                  {currentIterationStories.map((story) => {
                    return <h1 key={story.id}>{story.title}</h1>;
                  })}
                </div>
              ) : null}
              {showCurrentIteration ? (
                <div
                  className="stories-column"
                  style={{
                    marginRight: numColumns < 3 ? null : "2px",
                    marginLeft: numColumns < 3 ? null : "2px",
                    minWidth:
                      numColumns < 3 ? 80 / numColumns - 1 + "vw" : "30vw",
                  }}
                >
                  <h1>current iteration</h1>
                </div>
              ) : null}
              {showMyCol ? (
                <div
                  className="stories-column"
                  style={{
                    marginRight: numColumns < 3 ? null : "2px",
                    marginLeft: numColumns < 3 ? null : "2px",
                    minWidth:
                      numColumns < 3 ? 80 / numColumns - 1 + "vw" : "30vw",
                  }}
                >
                  <h1>mycol1</h1>
                </div>
              ) : null}
              {showMyCol2 ? (
                <div
                  className="stories-column"
                  style={{
                    marginRight: numColumns < 3 ? null : "2px",
                    marginLeft: numColumns < 3 ? null : "2px",
                    minWidth:
                      numColumns < 3 ? 80 / numColumns - 1 + "vw" : "30vw",
                  }}
                >
                  <h1>mycol2</h1>
                </div>
              ) : null}
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
  } else {
    return <h1>loading</h1>;
  }
};

export default Project;
