import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../App";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import StoriesColumn from "../component/StoriesColumn";

const Project = () => {
  const { projectId } = useParams();
  const [projectDetails, setProjectDetails] = useState({});
  const { username, setProject } = useContext(AppContext);
  const [showMyStories, setShowMyStories] = useState(true);
  const [showCurrentIteration, setShowCurrentIteration] = useState(true);
  const [showIceBox, setShowIceBox] = useState(true);
  const [showMyCol2, setShowMyCol2] = useState(true);
  const numColumns =
    showCurrentIteration + showMyStories + showIceBox + showMyCol2;

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
          assignee: "asdf",
          points: 3,
          isFinished: false,
          dateCreated: "December 27, 2022",
          type: "feature",
        },
        {
          id: 1234,
          title: "sample story 2",
          assignee: "asdf",
          points: 5,
          isFinished: false,
          dateCreated: "December 28, 2022",
          type: "feature",
        },
        {
          id: 12345,
          title: "sample story 3",
          assignee: "SR",
          points: 2,
          isFinished: false,
          dateCreated: "December 28, 2022",
          type: "feature",
        },
        {
          id: 223,
          title: "sample story",
          assignee: "asdf",
          points: 3,
          isFinished: false,
          dateCreated: "December 27, 2022",
          type: "feature",
        },
        {
          id: 2234,
          title: "sample story 2",
          assignee: "asdf",
          points: 5,
          isFinished: false,
          dateCreated: "December 28, 2022",
          type: "feature",
        },
        {
          id: 22345,
          title: "sample story 3",
          assignee: "SR",
          points: 2,
          isFinished: false,
          dateCreated: "December 28, 2022",
          type: "feature",
        },
        {
          id: 323,
          title: "sample story",
          assignee: "asdf",
          points: 3,
          isFinished: false,
          dateCreated: "December 27, 2022",
          type: "feature",
        },
        {
          id: 3234,
          title: "sample story 2",
          assignee: "asdf",
          points: 5,
          isFinished: false,
          dateCreated: "December 28, 2022",
          type: "feature",
        },
        {
          id: 32345,
          title: "sample story 3",
          assignee: "SR",
          points: 2,
          isFinished: false,
          dateCreated: "December 28, 2022",
          type: "feature",
        },
      ],
      iceBoxStories: [
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
  const [iceBoxStories, setIceBoxStories] = useState([]);

  const myStories = currentIterationStories.filter(
    (story) => story.assignee === username
  );

  const handleDrop = (droppedItem, storyList, setStoryList) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...storyList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setStoryList(updatedList);
  };

  useEffect(() => {
    setProjectDetails(getProjectDetails(projectId));
    setCurrentIterationStories(
      getProjectDetails(projectId).currentIterationStories
    );
    setIceBoxStories(getProjectDetails(projectId).iceBoxStories);
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
                  setShowIceBox(!showIceBox);
                }}
                style={{ color: showIceBox ? "white" : "gray" }}
              >
                Ice Box
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
                <StoriesColumn
                  draggable={false}
                  storyList={myStories}
                  setShowStoryList={setShowMyStories}
                  handleDrop={(e) =>
                    handleDrop(
                      e,
                      currentIterationStories,
                      setCurrentIterationStories
                    )
                  }
                  numColumns={numColumns}
                  columnName="My Stories"
                />
              ) : null}
              {showCurrentIteration ? (
                <StoriesColumn
                  storyList={currentIterationStories}
                  setShowStoryList={setShowCurrentIteration}
                  handleDrop={(e) =>
                    handleDrop(
                      e,
                      currentIterationStories,
                      setCurrentIterationStories
                    )
                  }
                  numColumns={numColumns}
                  columnName="Current Iteration"
                />
              ) : null}
              {showIceBox ? (
                <StoriesColumn
                  storyList={iceBoxStories}
                  setShowStoryList={setShowIceBox}
                  handleDrop={(e) =>
                    handleDrop(e, iceBoxStories, setIceBoxStories)
                  }
                  numColumns={numColumns}
                  columnName="IceBox"
                />
              ) : null}
              {showMyCol2 ? (
                <StoriesColumn
                  storyList={currentIterationStories}
                  setShowStoryList={setShowMyCol2}
                  handleDrop={(e) =>
                    handleDrop(
                      e,
                      currentIterationStories,
                      setCurrentIterationStories
                    )
                  }
                  numColumns={numColumns}
                  columnName="My Col 2"
                />
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
