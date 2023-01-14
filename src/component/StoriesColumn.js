import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ContentPlaceholder from "./ContentPlaceholder";
import { useRef, useState, useEffect } from "react";
const StoriesColumn = ({
  storyList,
  setShowStoryList,
  handleDrop,
  numColumns,
  columnName,
  draggable = true,
}) => {
  const [showStoryArr, setShowStoryArr] = useState([]);

  useEffect(() => {
    setShowStoryArr(storyList.map(() => false));
  }, []);

  return (
    <div
      className="stories-column"
      style={{
        marginRight: numColumns < 3 ? null : "2px",
        marginLeft: numColumns < 3 ? null : "2px",
        minWidth: numColumns < 3 ? 80 / numColumns - 1 + "vw" : "30vw",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: "4px",
          marginRight: "4px",
        }}
      >
        <h3>{columnName}</h3>
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <button onClick={() => setShowStoryList(false)}>X</button>
        </span>
      </div>
      <div
        style={{
          overflowY: "auto",
          backgroundColor: "#eee",
          height: "100%",
        }}
      >
        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <div
                className="list-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {storyList.map((story, index) =>
                  !showStoryArr[index] ? (
                    <div
                      onClick={() => {
                        console.log("fug");
                        setShowStoryArr([
                          ...showStoryArr.slice(0, index),
                          true,
                          ...showStoryArr.slice(index + 1),
                        ]);
                      }}
                    >
                      <Draggable
                        key={story.id}
                        draggableId={story.id.toString()}
                        index={index}
                        isDragDisabled={!draggable}
                      >
                        {(provided) => (
                          <div
                            className="item-container"
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            title={
                              draggable
                                ? ""
                                : "Use Current Iteration to change your story order"
                            }
                          >
                            <span
                              style={{
                                cursor: draggable
                                  ? "all-scroll"
                                  : "not-allowed",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "25px 10px",
                              }}
                            >
                              {story.title} ({story.assignee})
                              <button>Just A Test</button>
                            </span>
                          </div>
                        )}
                      </Draggable>
                    </div>
                  ) : (
                    <div> placeholder </div>
                  )
                )}
                {storyList.length === 0 ? (
                  <>
                    <ContentPlaceholder color={"#ccc"} />
                    <h3
                      style={{
                        margin: "10% 10% 0% 10%  ",
                      }}
                    >
                      Nothing here yet. Add stories to this list!
                    </h3>
                  </>
                ) : null}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default StoriesColumn;
