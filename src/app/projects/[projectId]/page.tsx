'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Navigation from '../../page';
import { useAppContext } from '@/lib/registry';

interface Story {
  id: number;
  title: string;
  assignee: string;
  points: string | number;
  isFinished: boolean;
  isDelivered: boolean;
  isRejected: boolean;
  isAccepted: boolean;
  mentor: string;
  secondaryAssignee: string;
  secondaryMentor: string;
  aTeamSupportTime: string;
  standupComments: string;
  sessionAndPMComments: string;
  dateCreated: string;
  type: string;
}

function ContentPlaceholder({ color }: { color: string }) {
  const heights = [50, 30, 40, 50];
  return (
    <>
      <div style={{ marginTop: '20%' }} />
      {heights.map((height, index) => (
        <div
          key={height + '' + index}
          style={{
            margin: '2% 10% 0% 10%',
            backgroundColor: color,
            height: height + 'px',
            borderRadius: '5pt',
          }}
        />
      ))}
    </>
  );
}

function StoriesColumn({
  filterBy = [],
  storyList,
  setStorylist,
  setShowStoryList,
  numColumns,
  columnName,
  setDoneList,
  doneList,
  draggable = true,
  username,
}: {
  filterBy?: string[];
  storyList: Story[];
  setStorylist: (stories: Story[]) => void;
  setShowStoryList: (show: boolean) => void;
  numColumns: number;
  columnName: string;
  setDoneList: (stories: Story[]) => void;
  doneList: Story[];
  draggable?: boolean;
  username: string;
}) {
  const [showStoryMap, setShowStoryMap] = useState(new Map<number, boolean>());
  const [localStoryList, setLocalStoryList] = useState(storyList);

  useEffect(() => {
    setLocalStoryList(storyList);
  }, [storyList]);

  const handleDragEnd = (result: { source: { index: number }; destination?: { index: number } }) => {
    if (!result.destination) return;
    const updated = [...localStoryList];
    const [reordered] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, reordered);
    setLocalStoryList(updated);
    setStorylist(updated);
  };

  return (
    <div
      className="stories-column"
      style={{
        marginRight: numColumns < 3 ? undefined : '2px',
        marginLeft: numColumns < 3 ? undefined : '2px',
        minWidth: numColumns < 3 ? `${80 / numColumns - 1}vw` : '30vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: '10px',
          marginRight: '10px',
        }}
      >
        <h3>{columnName}</h3>
        <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <button onClick={() => setShowStoryList(false)}>X</button>
        </span>
      </div>
      <div style={{ overflowY: 'auto', backgroundColor: '#eee', height: '100%' }}>
        {localStoryList.map((story, index) => {
          if (filterBy.length > 0 && story.assignee !== filterBy[0]) return null;
          return (
            <div
              key={story.id + '' + index}
              onClick={() => setShowStoryMap(new Map(showStoryMap.set(story.id, !showStoryMap.get(story.id))))}
            >
              {!showStoryMap.get(story.id) ? (
                <div
                  className={`item-container ${story.assignee === 'none' ? 'none-assigned' : ''}`}
                  title={draggable ? '' : 'Use Current Iteration to change your story order'}
                >
                  <span
                    style={{
                      cursor: draggable ? 'all-scroll' : 'default',
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '25px 10px',
                    }}
                  >
                    {story.title}
                    {story.assignee !== 'none' && ` (${story.assignee})`}
                    {story.assignee === 'none' && (
                      <button
                        onClick={(e) => {
                          const updated = [...localStoryList];
                          updated[index] = { ...story, assignee: username };
                          setLocalStoryList(updated);
                          setStorylist(updated);
                          e.stopPropagation();
                        }}
                      >
                        Start
                      </button>
                    )}
                    {story.isRejected && (
                      <button
                        onClick={(e) => {
                          const updated = [...localStoryList];
                          updated[index] = { ...story, isRejected: false };
                          setLocalStoryList(updated);
                          setStorylist(updated);
                          e.stopPropagation();
                        }}
                      >
                        Restart
                      </button>
                    )}
                    {!story.isFinished && story.assignee !== 'none' && !story.isRejected && (
                      <button
                        onClick={(e) => {
                          const updated = [...localStoryList];
                          updated[index] = { ...story, isFinished: true };
                          setLocalStoryList(updated);
                          setStorylist(updated);
                          e.stopPropagation();
                        }}
                      >
                        Finish
                      </button>
                    )}
                    {story.isFinished && !story.isDelivered && (
                      <button
                        onClick={(e) => {
                          const updated = [...localStoryList];
                          updated[index] = { ...story, isDelivered: true };
                          setLocalStoryList(updated);
                          setStorylist(updated);
                          e.stopPropagation();
                        }}
                      >
                        Deliver
                      </button>
                    )}
                    {story.isDelivered && !story.isAccepted && (
                      <span style={{ display: 'flex', flexDirection: 'row' }}>
                        <button
                          onClick={(e) => {
                            const updated = localStoryList.filter((_, i) => i !== index);
                            setLocalStoryList(updated);
                            setStorylist(updated);
                            setDoneList([...doneList, { ...story, isAccepted: true }]);
                            e.stopPropagation();
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            const updated = [...localStoryList];
                            updated[index] = { ...story, isFinished: false, isDelivered: false, isRejected: true };
                            setLocalStoryList(updated);
                            setStorylist(updated);
                            e.stopPropagation();
                          }}
                        >
                          Reject
                        </button>
                      </span>
                    )}
                  </span>
                </div>
              ) : (
                <div className="item-container-details">
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: '20px',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <h3
                      onClick={(e) => {
                        setShowStoryMap(new Map(showStoryMap.set(story.id, false)));
                        e.stopPropagation();
                      }}
                      className="text-button"
                    >
                      ^
                    </h3>
                    <h4 style={{ textAlign: 'center', width: '100%' }}>{story.title}</h4>
                  </span>
                  <form onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label htmlFor={`story-type-${story.id}`}>STORY TYPE</label>
                      <select
                        id={`story-type-${story.id}`}
                        defaultValue={story.type}
                        onChange={(e) => {
                          const updated = [...localStoryList];
                          updated[index] = { ...story, type: e.target.value };
                          setLocalStoryList(updated);
                          setStorylist(updated);
                        }}
                      >
                        <option value="feature">Feature</option>
                        <option value="bug">Bug</option>
                        <option value="chore">Chore</option>
                        <option value="release">Release</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`point-input-${story.id}`}>POINTS</label>
                      <select
                        id={`point-input-${story.id}`}
                        defaultValue={String(story.points)}
                        onChange={(e) => {
                          const updated = [...localStoryList];
                          updated[index] = { ...story, points: e.target.value };
                          setLocalStoryList(updated);
                          setStorylist(updated);
                        }}
                      >
                        <option value="unestimated">unestimated</option>
                        <option value="0">0 Points</option>
                        <option value="1">1 Points</option>
                        <option value="2">2 Points</option>
                        <option value="3">3 Points</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`notes-${story.id}`}>STANDUP MEETING COMMENTS</label>
                      <input
                        id={`notes-${story.id}`}
                        defaultValue={story.standupComments}
                        onChange={(e) => {
                          const updated = [...localStoryList];
                          updated[index] = { ...story, standupComments: e.target.value };
                          setLocalStoryList(updated);
                          setStorylist(updated);
                        }}
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          );
        })}
        {(localStoryList.length === 0 ||
          (filterBy.length > 0 && !localStoryList.some((s) => s.assignee === filterBy[0]))) && (
          <>
            <ContentPlaceholder color="#ccc" />
            <h3 style={{ margin: '10% 10% 0% 10%' }}>Nothing here yet. Add stories to this list!</h3>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { username, setProject } = useAppContext();
  const [showMyStories, setShowMyStories] = useState(true);
  const [showCurrentIteration, setShowCurrentIteration] = useState(true);
  const [showIcebox, setShowIcebox] = useState(true);
  const [showDoneStories, setShowDoneStories] = useState(true);
  const numColumns =
    (showMyStories ? 1 : 0) + (showCurrentIteration ? 1 : 0) + (showIcebox ? 1 : 0) + (showDoneStories ? 1 : 0);

  const sampleStories: Story[] = [
    { id: 123, title: 'sample story', assignee: username || 'asdf', points: 'unestimated', isFinished: false, isDelivered: false, isRejected: false, isAccepted: false, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'December 27, 2022', type: 'feature' },
    { id: 1234, title: 'sample story 2', assignee: 'none', points: 5, isFinished: false, isDelivered: false, isRejected: false, isAccepted: false, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'December 28, 2022', type: 'bug' },
    { id: 12345, title: 'sample story 3', assignee: 'SR', points: 2, isFinished: false, isDelivered: false, isRejected: false, isAccepted: false, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'December 28, 2022', type: 'feature' },
    { id: 223, title: 'sample story', assignee: username || 'asdf', points: 3, isFinished: false, isDelivered: false, isRejected: false, isAccepted: false, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'December 27, 2022', type: 'feature' },
    { id: 2234, title: 'sample story 2', assignee: username || 'asdf', points: 'unestimated', isFinished: false, isDelivered: false, isRejected: false, isAccepted: false, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'December 28, 2022', type: 'feature' },
    { id: 22345, title: 'sample story 3', assignee: 'SR', points: 2, isFinished: false, isDelivered: false, isRejected: false, isAccepted: false, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'December 28, 2022', type: 'feature' },
    { id: 323, title: 'sample story', assignee: username || 'asdf', points: 3, isFinished: false, isDelivered: false, isRejected: false, isAccepted: false, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'December 27, 2022', type: 'feature' },
    { id: 3234, title: 'sample story 2', assignee: username || 'asdf', points: 5, isFinished: false, isDelivered: false, isRejected: false, isAccepted: false, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'December 28, 2022', type: 'feature' },
    { id: 32345, title: 'sample story 3', assignee: 'SR', points: 2, isFinished: false, isDelivered: false, isRejected: false, isAccepted: false, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'December 28, 2022', type: 'feature' },
  ];

  const iceboxStories: Story[] = [
    { id: 998, title: 'forgotten story', assignee: 'SR', points: 2, isFinished: false, isDelivered: false, isRejected: false, isAccepted: false, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'December 12, 2022', type: 'feature' },
  ];

  const doneStories: Story[] = [
    { id: 222, title: 'finished story', assignee: username || 'asdf', points: 1, isFinished: true, isDelivered: true, isRejected: false, isAccepted: true, mentor: '', secondaryAssignee: '', secondaryMentor: '', aTeamSupportTime: '', standupComments: '', sessionAndPMComments: '', dateCreated: 'November 31, 2022', type: 'feature' },
  ];

  const [currentIterationStories, setCurrentIterationStories] = useState<Story[]>(sampleStories);
  const [iceboxStoriesState, setIceboxStoriesState] = useState<Story[]>(iceboxStories);
  const [doneStoriesState, setDoneStoriesState] = useState<Story[]>(doneStories);

  useEffect(() => {
    setProject('Sample');
  }, [setProject]);

  return (
    <div style={{ overflowY: 'hidden', height: '100vh' }}>
      <Navigation />
      <Tabs>
        <TabList className="navigation-tabs">
          <Tab>Stories</Tab>
          <Tab disabled>Analytics (Paid Feature)</Tab>
          <Tab>Members</Tab>
        </TabList>
        <TabPanel style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
          <>
            <div className="sidebar">
              <button
                className="sidebar-btn"
                onClick={() => setShowMyStories(!showMyStories)}
                style={{ color: showMyStories ? 'white' : 'gray' }}
              >
                My Stories
              </button>
              <button
                className="sidebar-btn"
                onClick={() => setShowCurrentIteration(!showCurrentIteration)}
                style={{ color: showCurrentIteration ? 'white' : 'gray' }}
              >
                Current Iteration
              </button>
              <button
                className="sidebar-btn"
                onClick={() => setShowIcebox(!showIcebox)}
                style={{ color: showIcebox ? 'white' : 'gray' }}
              >
                Icebox
              </button>
              <button
                className="sidebar-btn"
                onClick={() => setShowDoneStories(!showDoneStories)}
                style={{ color: showDoneStories ? 'white' : 'gray' }}
              >
                Done Stories
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                height: '91vh',
                width: '100%',
                justifyContent: numColumns < 3 ? 'space-evenly' : undefined,
              }}
            >
              {showMyStories && (
                <StoriesColumn
                  draggable={false}
                  filterBy={[username || 'asdf']}
                  storyList={currentIterationStories}
                  setStorylist={setCurrentIterationStories}
                  setShowStoryList={setShowMyStories}
                  numColumns={numColumns}
                  username={username || 'asdf'}
                  setDoneList={setDoneStoriesState}
                  doneList={doneStoriesState}
                  columnName="My Stories"
                />
              )}
              {showCurrentIteration && (
                <StoriesColumn
                  storyList={currentIterationStories}
                  setStorylist={setCurrentIterationStories}
                  setShowStoryList={setShowCurrentIteration}
                  numColumns={numColumns}
                  username={username || 'asdf'}
                  setDoneList={setDoneStoriesState}
                  doneList={doneStoriesState}
                  columnName="Current Iteration"
                />
              )}
              {showIcebox && (
                <StoriesColumn
                  storyList={iceboxStoriesState}
                  setStorylist={setIceboxStoriesState}
                  setShowStoryList={setShowIcebox}
                  numColumns={numColumns}
                  username={username || 'asdf'}
                  setDoneList={setDoneStoriesState}
                  doneList={doneStoriesState}
                  columnName="Icebox"
                />
              )}
              {showDoneStories && (
                <StoriesColumn
                  storyList={doneStoriesState}
                  setStorylist={setDoneStoriesState}
                  setShowStoryList={setShowDoneStories}
                  numColumns={numColumns}
                  username={username || 'asdf'}
                  setDoneList={setDoneStoriesState}
                  doneList={doneStoriesState}
                  columnName="Done Stories"
                />
              )}
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
    </div>
  );
}
