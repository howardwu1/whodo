import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ContentPlaceholder from "./ContentPlaceholder";
import { useState } from "react";
const StoriesColumn = ({
  filterBy = [],
  storyList,
  setStorylist,
  setShowStoryList,
  handleDrop,
  numColumns,
  columnName,
  draggable = true,
  username,
}) => {
  const [showStoryMap, setShowStoryMap] = useState(new Map());

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
          marginLeft: "10px",
          marginRight: "10px",
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
                  story.assignee === (filterBy[0] ?? story.assignee) ? (
                    <div
                      key={story.id + "" + index}
                      onClick={() => {
                        setShowStoryMap(
                          new Map(showStoryMap.set(story.id, true))
                        );
                      }}
                    >
                      <Draggable
                        key={story.id}
                        draggableId={story.id.toString()}
                        index={index}
                        isDragDisabled={!draggable}
                      >
                        {(provided) =>
                          !showStoryMap.get(story.id) ? (
                            <div
                              className={
                                "item-container " +
                                (story.assignee !== "none"
                                  ? ""
                                  : "none-assigned")
                              }
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
                                  cursor: draggable ? "all-scroll" : "default",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "25px 10px",
                                }}
                              >
                                {story.title}{" "}
                                {story.assignee === "none"
                                  ? null
                                  : `(${story.assignee})`}
                                {story.assignee === "none" ? (
                                  <button
                                    onClick={(e) => {
                                      setStorylist([
                                        ...storyList.slice(0, index),
                                        {
                                          ...story,
                                          assignee: username,
                                        },
                                        ...storyList.slice(index + 1),
                                      ]);
                                      e.stopPropagation();
                                    }}
                                  >
                                    Start
                                  </button>
                                ) : null}
                                {!story.isFinished &&
                                story.assignee !== "none" ? (
                                  <button
                                    onClick={(e) => {
                                      setStorylist([
                                        ...storyList.slice(0, index),
                                        {
                                          ...story,
                                          isFinished: true,
                                        },
                                        ...storyList.slice(index + 1),
                                      ]);
                                      e.stopPropagation();
                                    }}
                                  >
                                    Finish
                                  </button>
                                ) : null}
                                {story.isFinished && !story.isDelivered ? (
                                  <button
                                    onClick={(e) => {
                                      setStorylist([
                                        ...storyList.slice(0, index),
                                        {
                                          ...story,
                                          isDelivered: true,
                                        },
                                        ...storyList.slice(index + 1),
                                      ]);
                                      e.stopPropagation();
                                    }}
                                  >
                                    Deliver
                                  </button>
                                ) : null}
                                {}
                              </span>
                            </div>
                          ) : (
                            <div
                              className="item-container-details"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <h3
                                  onClick={(e) => {
                                    setStorylist([
                                      ...storyList.slice(0, index),
                                      {
                                        ...story,
                                        type: story.type,
                                        points: story.points,
                                      },
                                      ...storyList.slice(index + 1),
                                    ]);
                                    setShowStoryMap(
                                      new Map(showStoryMap.set(story.id, false))
                                    );
                                    e.stopPropagation();
                                  }}
                                  className="text-button"
                                >
                                  ^
                                </h3>
                                {story.title}
                              </span>
                              <form onClick={(e) => e.stopPropagation()}>
                                <div className="story-group">
                                  <label htmlFor="story-type">STORY TYPE</label>
                                  <select
                                    id="story-type"
                                    defaultValue={story.type}
                                    onInput={(e) =>
                                      (story.type = e.target.value)
                                    }
                                  >
                                    <option value="feature">Feature</option>
                                    <option value="bug">Bug</option>
                                    <option value="chore">Chore</option>
                                    <option value="release">Release</option>
                                  </select>
                                </div>

                                <div className="point-system">
                                  <label htmlFor="point-input">POINTS</label>
                                  <select
                                    id="point-input"
                                    defaultValue={story.points}
                                    onInput={(e) =>
                                      (story.points = e.target.value)
                                    }
                                  >
                                    <option value="unestimated">
                                      unestimated
                                    </option>
                                    <option value="0">0 Points</option>
                                    <option value="1">1 Points</option>
                                    <option value="2">2 Points</option>
                                    <option vaule="3">3 Points</option>
                                  </select>
                                </div>
                              </form>
                            </div>
                          )
                        }
                      </Draggable>
                    </div>
                  ) : null
                )}
                {storyList.length === 0 ||
                storyList.filter(
                  (story) => story.assignee === (filterBy[0] ?? story.assignee)
                ).length === 0 ? (
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
