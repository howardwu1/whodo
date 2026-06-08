'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { useAppContext } from '@/lib/registry';

export default function MembersPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { username } = useAppContext();
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [projectMembersFull, setProjectMembersFull] = useState<any[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<string[]>([]);
  const [confirmAddModal, setConfirmAddModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<any>(null);
  const [confirmRemoveModal, setConfirmRemoveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
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
            <p>Loading members...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowY: 'hidden', height: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '20px' }}>
          <Link 
            href={`/projects/${projectId}`}
            style={{ textDecoration: 'none', color: '#191970', fontSize: '24px' }}
          >
            ←
          </Link>
          <h1 style={{ margin: 0 }}>Project Members</h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span>{projectMembers.length} member(s)</span>
          <button
            onClick={() => { setShowAddMember(!showAddMember); if (!showAddMember) { fetchAllUsers(); setSelectedUsersToAdd([]); } }}
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
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px', maxWidth: '500px' }}>
            <div style={{ marginBottom: '10px', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}>
              {allUsers
                .filter((user: any) => !projectMembers.includes(user.username))
                .map((user: any) => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'flex-start', padding: '4px 8px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
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
                      style={{ marginRight: '8px', marginLeft: 0, flexShrink: 0, width: '12px', height: '12px' }}
                    />
                    <span style={{ fontSize: '13px' }}>{user.username}</span>
                  </div>
                ))}
            </div>
            {selectedUsersToAdd.length > 0 && (
              <button
                onClick={() => setConfirmAddModal(true)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#191970',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Add ({selectedUsersToAdd.length})
              </button>
            )}
          </div>
        )}

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {projectMembersFull.map((member, index) => (
            <li key={index} style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>{member.user.username}</span>
              <button
                onClick={() => { setMemberToRemove(member); setConfirmRemoveModal(true); }}
                style={{
                  padding: '4px 10px',
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

        {projectMembers.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
            No members yet. Add someone to get started!
          </p>
        )}
      </div>

      {/* Confirm Add Modal */}
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

      {/* Confirm Remove Modal */}
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
    </div>
  );
}
