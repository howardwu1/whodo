'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import EditIcon from '@mui/icons-material/Edit';
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
            headers: { 'Content-Type': 'application/json' },
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
    const updated = localStoryList.map(s =>
      s.id === story.id ? { ...s, ...updates } : s
    );
    setLocalStoryList(updated);
    setStorylist(updated);

    if (story.dbId) {
      try {
        await fetch('/api/stories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: story.dbId, ...updates }),
        });
      } catch (error) {
        console.error('Error updating story:', error);
      }
    }
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
              minWidth: numColumns < 3 ? `${80 / numColumns - 1}vw` : '30vw',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: '10px',
                marginRight: '10px',
                padding: '10px 0',
                backgroundColor: 'darkgrey',
              }}
            >
              <h3>{columnName}</h3>
              <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <button onClick={() => setShowStoryList(false)}>X</button>
              </span>
            </div>
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                overflowY: 'auto',
                backgroundColor: '#eee',
                flex: 1,
                minHeight: 0,
              }}
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
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [projectMembersFull, setProjectMembersFull] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'stories' | 'members'>('stories');
  const [showAddMember, setShowAddMember] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<string[]>([]);
  const [confirmAddModal, setConfirmAddModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<any>(null);
  const [confirmRemoveModal, setConfirmRemoveModal] = useState(false);

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
    { title: 'finished story', assignee: username || 'asdf', points: 1, type: 'feature', dateCreated: 'November 31, 2022', isFinished: true, isDelivered: true, isAccepted: true },
  ];

  useEffect(() => {
    setProject('Sample');
  }, [setProject]);

  // Fetch or seed stories from database
  useEffect(() => {
    async function loadStories() {
      try {
        const res = await fetch(`/api/stories?projectId=${projectId}`);
        const data = await res.json();

        if (data.length === 0) {
          // Seed default stories
          const currentIteration = await Promise.all(
            defaultStories.map(s => 
              fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...s, projectId, status: 'current_iteration' }),
              }).then(r => r.json())
            )
          );
          const icebox = await Promise.all(
            iceboxDefaultStories.map(s =>
              fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...s, projectId, status: 'icebox' }),
              }).then(r => r.json())
            )
          );
          const done = await Promise.all(
            doneDefaultStories.map(s =>
              fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

  // Fetch project members
  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch(`/api/project-members?projectId=${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProjectMembers(data.map((m: any) => m.user.username));
          setProjectMembersFull(data);
        }
      } catch (error) {
        console.error('Error loading members:', error);
      }
    }
    loadMembers();
  }, [projectId]);

  const handleAddMembers = async () => {
    if (selectedUsersToAdd.length === 0) return;
    try {
      for (const userId of selectedUsersToAdd) {
        const res = await fetch('/api/project-members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, userId }),
        });
        if (res.ok) {
          const data = await res.json();
          setProjectMembers([...projectMembers, data.user.username]);
          setProjectMembersFull([...projectMembersFull, data]);
        }
      }
      setSelectedUsersToAdd([]);
      setShowAddMember(false);
      setConfirmAddModal(false);
    } catch (error) {
      console.error('Error adding members:', error);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      const res = await fetch(`/api/project-members?projectId=${projectId}&userId=${memberToRemove.user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjectMembers(projectMembers.filter(m => m !== memberToRemove.user.username));
        setProjectMembersFull(projectMembersFull.filter(m => m.user.id !== memberToRemove.user.id));
        setMemberToRemove(null);
        setConfirmRemoveModal(false);
      }
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const users = await res.json();
        setAllUsers(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
          <button
            onClick={() => setActiveTab('members')}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              borderBottom: activeTab === 'members' ? '2px solid #191970' : '2px solid transparent',
              color: activeTab === 'members' ? '#191970' : '#666',
            }}
          >
            Members ({projectMembers.length})
          </button>
        </div>

        <div style={{ display: 'flex', height: 'calc(100vh - 90px)', overflow: 'hidden' }}>
          <div className="sidebar">
            <button
              className="sidebar-btn"
              onClick={() => setShowCreateStory(true)}
              style={{ backgroundColor: '#191970', color: 'white' }}
            >
              + Create Story
            </button>
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
              {activeTab === 'stories' && showMyStories && (
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
              {activeTab === 'stories' && showCurrentIteration && (
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
              {activeTab === 'stories' && showIcebox && (
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
              {activeTab === 'stories' && showDoneStories && (
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

            {activeTab === 'members' && (
              <div style={{ padding: '20px', width: '100%', height: '100%', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>Project Members</h2>
                  <button
                    onClick={() => { setShowAddMember(!showAddMember); if (!showAddMember) fetchAllUsers(); }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#191970',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    + Add Member
                  </button>
                </div>
                
                {showAddMember && (
                  <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', maxWidth: '300px' }}>
                    <div style={{ marginBottom: '8px', maxHeight: '120px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}>
                      {allUsers
                        .filter((user: any) => !projectMembers.includes(user.username))
                        .map((user: any) => (
                          <div key={user.id} style={{ display: 'flex', alignItems: 'center', padding: '2px 8px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
                            <input
                              type="checkbox"
                              checked={selectedUsersToAdd.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsersToAdd([...selectedUsersToAdd, user.id]);
                                } else {
                                  setSelectedUsersToAdd(selectedUsersToAdd.filter(id => id !== user.id));
                                }
                              }}
                              style={{ marginRight: '8px', flexShrink: 0 }}
                            />
                            <span style={{ fontSize: '12px' }}>{user.username}</span>
                          </div>
                        ))}
                    </div>
                    {selectedUsersToAdd.length > 0 && (
                      <button
                        onClick={() => setConfirmAddModal(true)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#191970',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Add ({selectedUsersToAdd.length})
                      </button>
                    )}
                  </div>
                )}
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {projectMembersFull.map((member, index) => (
                    <li key={index} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{member.user.username}</span>
                      <button
                        onClick={() => { setMemberToRemove(member); setConfirmRemoveModal(true); }}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {confirmAddModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  minWidth: '300px',
                }}>
                  <h3>Add Members</h3>
                  <p>Are you sure you want to add {selectedUsersToAdd.length} member(s)?</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button
                      onClick={() => { setConfirmAddModal(false); }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ccc',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMembers}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#191970',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {confirmRemoveModal && memberToRemove && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  minWidth: '300px',
                }}>
                  <h3>Remove Member</h3>
                  <p>Are you sure you want to remove "{memberToRemove.user.username}" from this project?</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button
                      onClick={() => { setConfirmRemoveModal(false); setMemberToRemove(null); }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ccc',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRemoveMember}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showCreateStory && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    minWidth: '300px',
                  }}
                >
                  <h3>Create New Story</h3>
                  <input
                    type="text"
                    placeholder="Story title"
                    value={newStoryTitle}
                    onChange={(e) => setNewStoryTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                    autoFocus
                  />
                  <select
                    value={newStoryType}
                    onChange={(e) => setNewStoryType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  >
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                    <option value="chore">Chore</option>
                    <option value="release">Release</option>
                  </select>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setShowCreateStory(false);
                        setNewStoryTitle('');
                      }}
                      style={{ padding: '8px 16px', cursor: 'pointer' }}
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
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#191970',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
