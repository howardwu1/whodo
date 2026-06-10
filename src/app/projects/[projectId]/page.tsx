'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Navigation } from '@/components/Navigation';
import { useAppContext } from '@/lib/registry';

interface Story {
  id: number;
  dbId?: string;
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
  sourceIdentifier = '',
  onReorder,
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
  sourceIdentifier?: string;
  onReorder?: (sourceId: string, sourceIndex: number, destIndex: number) => void;
}) {
  const [showStoryMap, setShowStoryMap] = useState(new Map<number, boolean>());
  const [editingTitleId, setEditingTitleId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [localStoryList, setLocalStoryList] = useState(storyList);

  useEffect(() => {
    setLocalStoryList(storyList);
  }, [storyList]);

  // Handle click outside input to save title
  useEffect(() => {
    if (editingTitleId === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.title-edit-input') && !target.closest('.edit-btn')) {
        const story = localStoryList.find(s => s.id === editingTitleId);
        if (story) saveTitle(story);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingTitleId, editingTitle, localStoryList]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    // If we have a shared reorder handler, use it
    if (onReorder && sourceIdentifier) {
      onReorder(sourceIdentifier, result.source.index, result.destination.index);
      return;
    }

    // Local reorder fallback
    const updated = [...localStoryList];
    const [reordered] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, reordered);
    setLocalStoryList(updated);
    setStorylist(updated);
  };

  const startEditingTitle = (story: Story) => {
    setEditingTitleId(story.id);
    setEditingTitle(story.title);
    // Also expand the story when starting to edit
    setShowStoryMap(new Map(showStoryMap.set(story.id, true)));
  };

  const saveTitle = async (story: Story) => {
    if (editingTitle.trim() && editingTitle !== story.title) {
      const csrfToken = getCsrfToken();
      const updated = localStoryList.map(s =>
        s.id === story.id ? { ...s, title: editingTitle.trim() } : s
      );
      setLocalStoryList(updated);
      setStorylist(updated);
      
      // Save to database
      if (story.dbId) {
        try {
          await fetch('/api/stories', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-csrf-token': csrfToken,
            },
            body: JSON.stringify({ id: story.dbId, title: editingTitle.trim() }),
          });
        } catch (error) {
          console.error('Error saving title:', error);
        }
      }
    }
    setEditingTitleId(null);
    setEditingTitle('');
  };

  // Helper to update story locally and in database
  const updateStory = async (story: Story, updates: Partial<Story>) => {
    const csrfToken = getCsrfToken();
    const updated = localStoryList.map(s =>
      s.id === story.id ? { ...s, ...updates } : s
    );
    setLocalStoryList(updated);
    setStorylist(updated);

    if (story.dbId) {
      try {
        await fetch('/api/stories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
          },
          body: JSON.stringify({ id: story.dbId, ...updates }),
        });
      } catch (error) {
        console.error('Error updating story:', error);
      }
    }
  };

  // Helper to get CSRF token from cookies
  const getCsrfToken = (): string => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'whodo_csrf') {
        return value;
      }
    }
    return '';
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={columnName}>
        {(provided) => (
          <div
            className="stories-column"
            style={{
              marginRight: numColumns < 3 ? undefined : '2px',
              marginLeft: numColumns < 3 ? undefined : '2px',
              minWidth: numColumns < 3 ? `${64 / numColumns - 0.8}vw` : '24vw',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <div
              className="flex flex-row justify-between items-center px-4 py-3 bg-slate-600 text-white rounded-t-lg"
            >
              <h3 className="m-0 text-base font-semibold">{columnName}</h3>
              <IconButton 
                size="small" 
                onClick={() => setShowStoryList(false)}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="overflow-y-auto bg-slate-100 flex-1 min-h-0 p-2"
            >
              {localStoryList.map((story, index) => {
                if (filterBy.length > 0 && story.assignee !== filterBy[0]) return null;
                return (
                  <Draggable key={story.id} draggableId={story.id.toString()} index={index} isDragDisabled={!draggable}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
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
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                padding: '15px 10px',
                                width: '100%',
                                gap: '10px',
                              }}
                            >
                              {editingTitleId === story.id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                                  <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    onBlur={() => saveTitle(story)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') saveTitle(story);
                                      if (e.key === 'Escape') {
                                        setEditingTitleId(null);
                                        setEditingTitle('');
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                    style={{
                                      padding: '5px',
                                      fontSize: '16px',
                                      width: 'calc(100% - 20px)',
                                      boxSizing: 'border-box',
                                    }}
                                  />
                                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                    {story.assignee !== 'none' && <span>({story.assignee})</span>}
                                    {story.assignee === 'none' && (
                                      <button onClick={(e) => { e.stopPropagation(); updateStory(story, { assignee: username }); }}>Start</button>
                                    )}
                                    {story.isRejected && <button onClick={(e) => { e.stopPropagation(); updateStory(story, { isRejected: false }); }}>Restart</button>}
                                    {!story.isFinished && story.assignee !== 'none' && !story.isRejected && <button onClick={(e) => { e.stopPropagation(); updateStory(story, { isFinished: true }); }}>Finish</button>}
                                    {story.isFinished && !story.isDelivered && <button onClick={(e) => { e.stopPropagation(); updateStory(story, { isDelivered: true }); }}>Deliver</button>}
                                    {story.isDelivered && !story.isAccepted && <><button onClick={(e) => { e.stopPropagation(); const updated = localStoryList.filter((_, i) => i !== index); setLocalStoryList(updated); setStorylist(updated); setDoneList([...doneList, { ...story, isAccepted: true }]); }}>Accept</button><button onClick={(e) => { e.stopPropagation(); updateStory(story, { isFinished: false, isDelivered: false, isRejected: true }); }}>Reject</button></>}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <span style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}>
                                    <span style={{ wordBreak: 'break-word', flex: 1 }}>
                                      {story.title}
                                    </span>
                                  </span>
                                  <span style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <span>{story.assignee !== 'none' && ` (${story.assignee})`}</span>
                                    {story.assignee === 'none' && (
                                      <button onClick={(e) => { e.stopPropagation(); updateStory(story, { assignee: username }); }}>Start</button>
                                    )}
                                    {story.isRejected && <button onClick={(e) => { e.stopPropagation(); updateStory(story, { isRejected: false }); }}>Restart</button>}
                                    {!story.isFinished && story.assignee !== 'none' && !story.isRejected && <button onClick={(e) => { e.stopPropagation(); updateStory(story, { isFinished: true }); }}>Finish</button>}
                                    {story.isFinished && !story.isDelivered && <button onClick={(e) => { e.stopPropagation(); updateStory(story, { isDelivered: true }); }}>Deliver</button>}
                                    {story.isDelivered && !story.isAccepted && <><button onClick={(e) => { e.stopPropagation(); const updated = localStoryList.filter((_, i) => i !== index); setLocalStoryList(updated); setStorylist(updated); setDoneList([...doneList, { ...story, isAccepted: true }]); }}>Accept</button><button onClick={(e) => { e.stopPropagation(); updateStory(story, { isFinished: false, isDelivered: false, isRejected: true }); }}>Reject</button></>}
                                  </span>
                                </>
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
                      minHeight: '20px',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <h3
                      onClick={(e) => {
                        if (!editingTitleId) {
                          setShowStoryMap(new Map(showStoryMap.set(story.id, false)));
                        }
                        e.stopPropagation();
                      }}
                      className="text-button"
                    >
                      ^
                    </h3>
                    {editingTitleId === story.id ? (
                      <input
                        className="title-edit-input"
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveTitle(story);
                          if (e.key === 'Escape') {
                            setEditingTitleId(null);
                            setEditingTitle('');
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={() => {
                          setShowStoryMap(new Map(showStoryMap.set(story.id, true)));
                        }}
                        autoFocus
                        style={{ textAlign: 'center', flex: 1, padding: '2px 4px', fontSize: '16px' }}
                      />
                    ) : (
                      <h4 style={{ textAlign: 'center', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {story.title}
                        <button
                          className="edit-btn"
                          onClick={(e) => { e.stopPropagation(); startEditingTitle(story); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', marginLeft: '8px' }}
                          title="Edit title"
                        >
                          <EditIcon style={{ fontSize: '16px' }} />
                        </button>
                      </h4>
                    )}
                  </span>
                  <form onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label htmlFor={`story-type-${story.id}`}>STORY TYPE</label>
                      <select
                        id={`story-type-${story.id}`}
                        defaultValue={story.type}
                        onChange={(e) => {
                          updateStory(story, { type: e.target.value });
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
                          updateStory(story, { points: e.target.value });
                        }}
                      >
                        <option value="unestimated">unestimated</option>
                        <option value="0">0 Points</option>
                        <option value="1">1 Points</option>
                        <option value="2">2 Points</option>
                        <option value="3">3 Points</option>
                      </select>
                    </div>
                    <TextField
                      id={`notes-${story.id}`}
                      label="Standup Meeting Comments"
                      multiline
                      rows={2}
                      defaultValue={story.standupComments}
                      onChange={(e) => {
                        const updated = [...localStoryList];
                        updated[index] = { ...story, standupComments: e.target.value };
                        setLocalStoryList(updated);
                        setStorylist(updated);
                      }}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </form>
                </div>
              )}
              </div>
            )}
          </Draggable>
        );
        })}
        {(localStoryList.length === 0 ||
          (filterBy.length > 0 && !localStoryList.some((s) => s.assignee === filterBy[0]))) && (
          <>
            <ContentPlaceholder color="#ccc" />
            <h3 style={{ margin: '10% 10% 0% 10%' }}>Nothing here yet. Add stories to this list!</h3>
          </>
        )}
        {provided.placeholder}
      </div>
      </div>
    )}
  </Droppable>
</DragDropContext>
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

  const [currentIterationStories, setCurrentIterationStories] = useState<Story[]>([]);
  const [iceboxStoriesState, setIceboxStoriesState] = useState<Story[]>([]);
  const [doneStoriesState, setDoneStoriesState] = useState<Story[]>([]);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryType, setNewStoryType] = useState('feature');
  const [isLoading, setIsLoading] = useState(true);

  // Default stories to seed
  const defaultStories = [
    { title: 'sample story', assignee: username || 'asdf', points: 'unestimated', type: 'feature', dateCreated: 'December 27, 2022' },
    { title: 'sample story 2', assignee: 'none', points: 5, type: 'bug', dateCreated: 'December 28, 2022' },
    { title: 'sample story 3', assignee: 'SR', points: 2, type: 'feature', dateCreated: 'December 28, 2022' },
    { title: 'sample story', assignee: username || 'asdf', points: 3, type: 'feature', dateCreated: 'December 27, 2022' },
    { title: 'sample story 2', assignee: username || 'asdf', points: 'unestimated', type: 'feature', dateCreated: 'December 28, 2022' },
    { title: 'sample story 3', assignee: 'SR', points: 2, type: 'feature', dateCreated: 'December 28, 2022' },
    { title: 'sample story', assignee: username || 'asdf', points: 3, type: 'feature', dateCreated: 'December 27, 2022' },
    { title: 'sample story 2', assignee: username || 'asdf', points: 5, type: 'feature', dateCreated: 'December 28, 2022' },
    { title: 'sample story 3', assignee: 'SR', points: 2, type: 'feature', dateCreated: 'December 28, 2022' },
  ];

  const iceboxDefaultStories = [
    { title: 'forgotten story', assignee: 'SR', points: 2, type: 'feature', dateCreated: 'December 12, 2022' },
  ];

  const doneDefaultStories = [
    { title: 'finished story', assignee: username || 'asdf', points: 1, type: 'feature', dateCreated: 'November 30, 2022', isFinished: true, isDelivered: true, isAccepted: true },
  ];

  useEffect(() => {
    setProject('Sample');
  }, [setProject]);

  // Fetch or seed stories from database
  useEffect(() => {
    async function loadStories() {
      try {
        const res = await fetch(`/api/stories?projectId=${projectId}`);
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();

        if (data.length === 0) {
          // Helper to get CSRF token from cookies
          const getCsrfToken = (): string => {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
              const [name, value] = cookie.trim().split('=');
              if (name === 'whodo_csrf') {
                return value;
              }
            }
            return '';
          };
          const csrfToken = getCsrfToken();
          const csrfHeaders = {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
          };
          // Seed default stories
          const currentIteration = await Promise.all(
            defaultStories.map(s => 
              fetch('/api/stories', {
                method: 'POST',
                headers: csrfHeaders,
                body: JSON.stringify({ ...s, projectId, status: 'current_iteration' }),
              }).then(r => r.json())
            )
          );
          const icebox = await Promise.all(
            iceboxDefaultStories.map(s =>
              fetch('/api/stories', {
                method: 'POST',
                headers: csrfHeaders,
                body: JSON.stringify({ ...s, projectId, status: 'icebox' }),
              }).then(r => r.json())
            )
          );
          const done = await Promise.all(
            doneDefaultStories.map(s =>
              fetch('/api/stories', {
                method: 'POST',
                headers: csrfHeaders,
                body: JSON.stringify({ ...s, projectId, status: 'done' }),
              }).then(r => r.json())
            )
          );

          // Convert database stories to frontend format with numeric IDs, preserving dbId
          let idCounter = 100;
          setCurrentIterationStories(currentIteration.map(s => ({ ...s, id: idCounter++, dbId: s.id })));
          setIceboxStoriesState(icebox.map(s => ({ ...s, id: idCounter++, dbId: s.id })));
          setDoneStoriesState(done.map(s => ({ ...s, id: idCounter++, dbId: s.id })));
        } else {
          // Group stories by status
          const current = data.filter((s: any) => s.status === 'current_iteration');
          const icebox = data.filter((s: any) => s.status === 'icebox');
          const done = data.filter((s: any) => s.status === 'done');

          let idCounter = 100;
          setCurrentIterationStories(current.map((s: any) => ({ ...s, id: idCounter++, dbId: s.id })));
          setIceboxStoriesState(icebox.map((s: any) => ({ ...s, id: idCounter++, dbId: s.id })));
          setDoneStoriesState(done.map((s: any) => ({ ...s, id: idCounter++, dbId: s.id })));
        }
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStories();
  }, [projectId]);

  // Unified reorder handler for stories across all columns
  const handleStoryReorder = (sourceId: string, sourceIndex: number, destIndex: number) => {
    if (sourceId === 'current_iteration' || sourceId === 'icebox' || sourceId === 'done') {
      const sourceList = sourceId === 'current_iteration' ? currentIterationStories
        : sourceId === 'icebox' ? iceboxStoriesState
        : doneStoriesState;
      const setSourceList = sourceId === 'current_iteration' ? setCurrentIterationStories
        : sourceId === 'icebox' ? setIceboxStoriesState
        : setDoneStoriesState;

      const updated = [...sourceList];
      const [reordered] = updated.splice(sourceIndex, 1);
      updated.splice(destIndex, 0, reordered);
      setSourceList(updated);
    }
  };

  if (isLoading) {
    return (
      <div style={{ overflowY: 'hidden', height: '100vh' }}>
        <Navigation />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #191970', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p>Loading stories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowY: 'hidden', height: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
          <button
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              borderBottom: '2px solid #191970',
            }}
          >
            Stories
          </button>
          <button
            disabled
            style={{
              padding: '10px 20px',
              cursor: 'not-allowed',
              color: '#999',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Analytics (Paid Feature)
          </button>
          <Link
            href={`/projects/${projectId}/members`}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              color: '#666',
            }}
          >
            Members
          </Link>
        </div>

        <div className="flex h-[calc(100vh-90px)] overflow-hidden">
          <div className="sidebar">
            <button
              className="sidebar-btn !bg-indigo-600 !text-white hover:!bg-indigo-700"
              onClick={() => setShowCreateStory(true)}
            >
              + Create Story
            </button>
            <button
              className="sidebar-btn"
              onClick={() => setShowMyStories(!showMyStories)}
              style={{ color: showMyStories ? '#191970' : '#6b7280', fontWeight: showMyStories ? 600 : 400 }}
            >
              My Stories
            </button>
            <button
              className="sidebar-btn"
              onClick={() => setShowCurrentIteration(!showCurrentIteration)}
              style={{ color: showCurrentIteration ? '#191970' : '#6b7280', fontWeight: showCurrentIteration ? 600 : 400 }}
            >
              Current Iteration
            </button>
            <button
              className="sidebar-btn"
              onClick={() => setShowIcebox(!showIcebox)}
              style={{ color: showIcebox ? '#191970' : '#6b7280', fontWeight: showIcebox ? 600 : 400 }}
            >
              Icebox
            </button>
            <button
              className="sidebar-btn"
              onClick={() => setShowDoneStories(!showDoneStories)}
              style={{ color: showDoneStories ? '#191970' : '#6b7280', fontWeight: showDoneStories ? 600 : 400 }}
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
                  draggable={true}
                  filterBy={[username || 'asdf']}
                  storyList={currentIterationStories}
                  setStorylist={setCurrentIterationStories}
                  setShowStoryList={setShowMyStories}
                  numColumns={numColumns}
                  username={username || 'asdf'}
                  setDoneList={setDoneStoriesState}
                  doneList={doneStoriesState}
                  columnName="My Stories"
                  sourceIdentifier="current_iteration"
                  onReorder={handleStoryReorder}
                />
              )}
              {showCurrentIteration && (
                <StoriesColumn
                  draggable={true}
                  storyList={currentIterationStories}
                  setStorylist={setCurrentIterationStories}
                  setShowStoryList={setShowCurrentIteration}
                  numColumns={numColumns}
                  username={username || 'asdf'}
                  setDoneList={setDoneStoriesState}
                  doneList={doneStoriesState}
                  columnName="Current Iteration"
                  sourceIdentifier="current_iteration"
                  onReorder={handleStoryReorder}
                />
              )}
              {showIcebox && (
                <StoriesColumn
                  draggable={true}
                  storyList={iceboxStoriesState}
                  setStorylist={setIceboxStoriesState}
                  setShowStoryList={setShowIcebox}
                  numColumns={numColumns}
                  username={username || 'asdf'}
                  setDoneList={setDoneStoriesState}
                  doneList={doneStoriesState}
                  columnName="Icebox"
                  sourceIdentifier="icebox"
                  onReorder={handleStoryReorder}
                />
              )}
              {showDoneStories && (
                <StoriesColumn
                  draggable={true}
                  storyList={doneStoriesState}
                  setStorylist={setDoneStoriesState}
                  setShowStoryList={setShowDoneStories}
                  numColumns={numColumns}
                  username={username || 'asdf'}
                  setDoneList={setDoneStoriesState}
                  doneList={doneStoriesState}
                  columnName="Done Stories"
                  sourceIdentifier="done"
                  onReorder={handleStoryReorder}
                />
              )}

            {showCreateStory && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
              >
                <Paper className="!p-6 !rounded-xl !min-w-[360px] shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="m-0 text-lg font-semibold text-gray-800">Create New Story</h3>
                    <IconButton size="small" onClick={() => { setShowCreateStory(false); setNewStoryTitle(''); }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                  <input
                    type="text"
                    placeholder="Story title"
                    value={newStoryTitle}
                    onChange={(e) => setNewStoryTitle(e.target.value)}
                    className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    autoFocus
                  />
                  <select
                    value={newStoryType}
                    onChange={(e) => setNewStoryType(e.target.value)}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                    <option value="chore">Chore</option>
                    <option value="release">Release</option>
                  </select>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowCreateStory(false);
                        setNewStoryTitle('');
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (newStoryTitle.trim()) {
                          const newStory: Story = {
                            id: Date.now(),
                            title: newStoryTitle,
                            assignee: 'none',
                            points: 'unestimated',
                            isFinished: false,
                            isDelivered: false,
                            isRejected: false,
                            isAccepted: false,
                            mentor: '',
                            secondaryAssignee: '',
                            secondaryMentor: '',
                            aTeamSupportTime: '',
                            standupComments: '',
                            sessionAndPMComments: '',
                            dateCreated: new Date().toLocaleDateString(),
                            type: newStoryType,
                          };
                          setCurrentIterationStories([...currentIterationStories, newStory]);
                          setShowCreateStory(false);
                          setNewStoryTitle('');
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                  </div>
                </Paper>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
