import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../App";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import StoriesColumn from "../component/StoriesColumn";

const Project = () => {
  const { projectId } = useParams();
  const { username, setProject } = useContext(AppContext);
  const [showMyStories, setShowMyStories] = useState(true);
  const [showCurrentIteration, setShowCurrentIteration] = useState(true);
  const [showIcebox, setShowIcebox] = useState(true);
  const [showDoneStories, setShowDoneStories] = useState(true);
  const numColumns =
    showCurrentIteration + showMyStories + showIcebox + showDoneStories;

  const getProjectDetails = (id) => {
    setProject("Sample");
    //placeholder
    return {
      id: id,
      name: "Sample",
      targetVelocity: [2, 2],
      velocity: [2, 1],
      currentIterationStories: [
        {
          id: 123,
          title: "sample story",
          assignee: "asdf",
          points: "unestimated",
          isFinished: false,
          isDelivered: false,
          isRejected: false,
          isAccepted: false,
          mentor: "",
          secondaryAssignee: "",
          secondaryMentor: "",
          aTeamSupportTime: "",
          standupComments: "",
          sessionAndPMComments: "",
          dateCreated: "December 27, 2022",
          type: "feature",
        },
        {
          id: 1234,
          title: "sample story 2",
          assignee: "none",
          points: 5,
          isFinished: false,
          isDelivered: false,
          isRejected: false,
          isAccepted: false,
          mentor: "",
          secondaryAssignee: "",
          secondaryMentor: "",
          aTeamSupportTime: "",
          standupComments: "",
          sessionAndPMComments: "",
          dateCreated: "December 28, 2022",
          type: "bug",
        },
        {
          id: 12345,
          title: "sample story 3",
          assignee: "SR",
          points: 2,
          isFinished: false,
          isDelivered: false,
          isRejected: false,
          isAccepted: false,
          mentor: "",
          secondaryAssignee: "",
          secondaryMentor: "",
          aTeamSupportTime: "",
          standupComments: "",
          sessionAndPMComments: "",
          dateCreated: "December 28, 2022",
          type: "feature",
        },
        {
          id: 223,
          title: "sample story",
          assignee: "asdf",
          points: 3,
          isFinished: false,
          isDelivered: false,
          isRejected: false,
          isAccepted: false,
          mentor: "",
          secondaryAssignee: "",
          secondaryMentor: "",
          aTeamSupportTime: "",
          standupComments: "",
          sessionAndPMComments: "",
          dateCreated: "December 27, 2022",
          type: "feature",
        },
        {
          id: 2234,
          title: "sample story 2",
          assignee: "asdf",
          points: "unestimated",
          isFinished: false,
          isDelivered: false,
          isRejected: false,
          isAccepted: false,
          mentor: "",
          secondaryAssignee: "",
          secondaryMentor: "",
          aTeamSupportTime: "",
          standupComments: "",
          sessionAndPMComments: "",
          dateCreated: "December 28, 2022",
          type: "feature",
        },
        {
          id: 22345,
          title: "sample story 3",
          assignee: "SR",
          points: 2,
          isFinished: false,
          isDelivered: false,
          isRejected: false,
          isAccepted: false,
          mentor: "",
          secondaryAssignee: "",
          secondaryMentor: "",
          aTeamSupportTime: "",
          standupComments: "",
          sessionAndPMComments: "",
          dateCreated: "December 28, 2022",
          type: "feature",
        },
        {
          id: 323,
          title: "sample story",
          assignee: "asdf",
          points: 3,
          isFinished: false,
          isDelivered: false,
          isRejected: false,
          isAccepted: false,
          mentor: "",
          secondaryAssignee: "",
          secondaryMentor: "",
          aTeamSupportTime: "",
          standupComments: "",
          sessionAndPMComments: "",
          dateCreated: "December 27, 2022",
          type: "feature",
        },
        {
          id: 3234,
          title: "sample story 2",
          assignee: "asdf",
          points: 5,
          isFinished: false,
          isDelivered: false,
          isRejected: false,
          isAccepted: false,
          mentor: "",
          secondaryAssignee: "",
          secondaryMentor: "",
          aTeamSupportTime: "",
          standupComments: "",
          sessionAndPMComments: "",
          dateCreated: "December 28, 2022",
          type: "feature",
        },
        {
          id: 32345,
          title: "sample story 3",
          assignee: "SR",
          points: 2,
          isFinished: false,
          isDelivered: false,
          isRejected: false,
          isAccepted: false,
          mentor: "",
          secondaryAssignee: "",
          secondaryMentor: "",
          aTeamSupportTime: "",
          standupComments: "",
          sessionAndPMComments: "",
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
          isDelivered: false,
          isRejected: false,
          isAccepted: false,
          mentor: "",
          secondaryAssignee: "",
          secondaryMentor: "",
          aTeamSupportTime: "",
          standupComments: "",
          sessionAndPMComments: "",
          dateCreated: "December 12, 2022",
          type: "feature",
        },
      ],
      doneStories: [
        {
          id: 222,
          title: "finished story",
          assignee: "asdf",
          points: 1,
          isFinished: true,
          isDelivered: true,
          isAccepted: true,
          dateCreated: "November 31, 2022",
          dateAccepted: "December 1, 2022",
          type: "feature",
        },
      ],
    };
  };

  const [currentIterationStories, setCurrentIterationStories] = useState([]);
  const [iceboxStories, setIceboxStories] = useState([]);
  const [doneStories, setDoneStories] = useState([]);

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
    setCurrentIterationStories(
      getProjectDetails(projectId).currentIterationStories
    );
    setIceboxStories(getProjectDetails(projectId).iceboxStories);
    setDoneStories(getProjectDetails(projectId).doneStories);
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
                  setShowIcebox(!showIcebox);
                }}
                style={{ color: showIcebox ? "white" : "gray" }}
              >
                Icebox
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  setShowDoneStories(!showDoneStories);
                }}
                style={{ color: showDoneStories ? "white" : "gray" }}
              >
                Done Stories
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
                  filterBy={[username]}
                  storyList={currentIterationStories}
                  setStorylist={setCurrentIterationStories}
                  setShowStoryList={setShowMyStories}
                  handleDrop={(e) =>
                    handleDrop(
                      e,
                      currentIterationStories,
                      setCurrentIterationStories
                    )
                  }
                  numColumns={numColumns}
                  username={username}
                  setDoneList={setDoneStories}
                  doneList={doneStories}
                  columnName="My Stories"
                />
              ) : null}
              {showCurrentIteration ? (
                <StoriesColumn
                  storyList={currentIterationStories}
                  setStorylist={setCurrentIterationStories}
                  setShowStoryList={setShowCurrentIteration}
                  handleDrop={(e) =>
                    handleDrop(
                      e,
                      currentIterationStories,
                      setCurrentIterationStories
                    )
                  }
                  numColumns={numColumns}
                  username={username}
                  setDoneList={setDoneStories}
                  doneList={doneStories}
                  columnName="Current Iteration"
                />
              ) : null}
              {showIcebox ? (
                <StoriesColumn
                  storyList={iceboxStories}
                  setStorylist={setIceboxStories}
                  setShowStoryList={setShowIcebox}
                  handleDrop={(e) =>
                    handleDrop(e, iceboxStories, setIceboxStories)
                  }
                  numColumns={numColumns}
                  username={username}
                  setDoneList={setDoneStories}
                  doneList={doneStories}
                  columnName="Icebox"
                />
              ) : null}
              {showDoneStories ? (
                <StoriesColumn
                  storyList={doneStories}
                  setStorylist={setDoneStories}
                  setShowStoryList={setShowDoneStories}
                  handleDrop={(e) => handleDrop(e, doneStories, setDoneStories)}
                  numColumns={numColumns}
                  username={username}
                  setDoneList={setDoneStories}
                  doneList={doneStories}
                  columnName="Done Stories"
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
