'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Paper, Checkbox, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
          setProjectMembers(prev => [...prev, data.user.username]);
          setProjectMembersFull(prev => [...prev, data]);
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
        setProjectMembers(prev => prev.filter(m => m !== memberToRemove.user.username));
        setProjectMembersFull(prev => prev.filter(m => m.user.id !== memberToRemove.user.id));
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
    <div className="h-screen overflow-y-hidden">
      <Navigation />
      <div className="max-w-4xl mx-auto p-5">
        <div className="flex items-center mb-5 gap-5">
          <Link 
            href={`/projects/${projectId}`}
            className="no-underline text-[#191970] text-2xl"
          >
            <ArrowBackIcon fontSize="inherit" />
          </Link>
          <h1 className="m-0">Project Members</h1>
        </div>

        <div className="flex justify-between items-center mb-5">
          <span className="text-sm text-gray-600">{projectMembers.length} member(s)</span>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => { setShowAddMember(!showAddMember); if (!showAddMember) { fetchAllUsers(); setSelectedUsersToAdd([]); } }}
            sx={{ backgroundColor: '#191970' }}
          >
            Add Member
          </Button>
        </div>

        {showAddMember && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2, maxWidth: 500 }}>
            <Box sx={{ mb: 2, maxHeight: 150, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 1, backgroundColor: 'white' }}>
              {allUsers
                .filter((user: any) => !projectMembers.includes(user.username))
                .map((user: any) => (
                  <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', p: 1, cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
                    <Checkbox
                      checked={selectedUsersToAdd.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsersToAdd([...selectedUsersToAdd, user.id]);
                        } else {
                          setSelectedUsersToAdd(selectedUsersToAdd.filter(id => id !== user.id));
                        }
                      }}
                      sx={{ ml: 0, mr: 1 }}
                      size="small"
                    />
                    <span className="text-sm">{user.username}</span>
                  </Box>
                ))}
            </Box>
            {selectedUsersToAdd.length > 0 && (
              <Button
                variant="contained"
                onClick={() => setConfirmAddModal(true)}
                sx={{ backgroundColor: '#191970' }}
                size="small"
              >
                Add ({selectedUsersToAdd.length})
              </Button>
            )}
          </Box>
        )}

        <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectMembersFull.map((member, index) => (
                <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell>{member.user.username}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => { setMemberToRemove(member); setConfirmRemoveModal(true); }}
                      sx={{ color: '#dc3545' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {projectMembers.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No members yet. Add someone to get started!
          </p>
        )}
      </div>

      {/* Confirm Add Modal */}
      <Dialog open={confirmAddModal} onClose={() => setConfirmAddModal(false)}>
        <DialogTitle>Add Members</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to add {selectedUsersToAdd.length} member(s)?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddMembers} variant="contained" sx={{ backgroundColor: '#191970' }}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Remove Modal */}
      <Dialog open={confirmRemoveModal} onClose={() => { setConfirmRemoveModal(false); setMemberToRemove(null); }}>
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to remove "{memberToRemove?.user?.username}" from this project?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setConfirmRemoveModal(false); setMemberToRemove(null); }}>Cancel</Button>
          <Button onClick={handleRemoveMember} variant="contained" sx={{ backgroundColor: '#dc3545' }}>Remove</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
