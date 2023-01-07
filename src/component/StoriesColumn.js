import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const StoriesColumn = ({
  storyList,
  setShowStoryList,
  handleDrop,
  numColumns,
  columnName,
  draggable = true,
}) => {
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
                {storyList.map((story, index) => (
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
                            cursor: draggable ? "all-scroll" : "not-allowed",
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "25px 10px",
                          }}
                        >
                          {story.title}

                          <button>Just A Test</button>
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {storyList.length === 0 ? (
                  <>
                    <div
                      style={{
                        margin: "20% 10% 0% 10%  ",
                        backgroundColor: "gray",
                        height: "50px",
                        borderRadius: "5pt",
                      }}
                    />

                    <div
                      style={{
                        margin: "2% 10% 0% 10%  ",
                        backgroundColor: "gray",
                        height: "30px",
                        borderRadius: "5pt",
                      }}
                    />

                    <div
                      style={{
                        margin: "2% 10% 0% 10%  ",
                        backgroundColor: "gray",
                        height: "40px",
                        borderRadius: "5pt",
                      }}
                    />
                    <div
                      style={{
                        margin: "2% 10% 0% 10%  ",
                        backgroundColor: "gray",
                        height: "50px",
                        borderRadius: "5pt",
                      }}
                    />
                    <h3
                      style={{
                        margin: "10% 10% 0% 10%  ",
                      }}
                    >
                      Nothing here yet. Add stories to your list!
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
