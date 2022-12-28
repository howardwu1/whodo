import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../App";

const Project = () => {
  const projectID = useParams();
  const [projectDetails, setProjectDetails] = useState({});
  const { setProject } = useContext(AppContext);

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

  return <h1>{projectDetails.name}</h1>;
};

export default Project;
