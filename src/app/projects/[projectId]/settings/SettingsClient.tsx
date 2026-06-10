'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Paper } from '@mui/material';
import { Navigation } from '@/components/Navigation';

interface SettingsClientProps {
  userId: string;
}

interface ProjectInfo {
  id: string;
  name: string;
  createdAt: string;
  userId: string;
  ownerUsername: string;
}

export default function SettingsClient({ userId }: SettingsClientProps) {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects?projectId=${projectId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.project) {
            setProject(data.project);
            setIsOwner(data.project.userId === userId);
          }
        } else if (res.status === 404) {
          // Project not found, redirect to home
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [projectId, userId, router]);

  const handleDeleteProject = async () => {
    if (deleteConfirmText !== project?.name) {
      return; // Don't delete if confirmation doesn't match
    }

    setIsDeleting(true);
    const csrfToken = getCsrfToken();
    try {
      const res = await fetch(`/api/projects?projectId=${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to delete project');
        setIsDeleting(false);
        setShowDeleteDialog(false);
        setDeleteConfirmText('');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setIsDeleting(false);
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
            <p>Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  // Non-owner access - show 403 or redirect
  if (!isOwner && project) {
    return (
      <div style={{ overflowY: 'hidden', height: '100vh' }}>
        <Navigation />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              You must be the project owner to access settings.
            </Typography>
            <Button
              component={Link}
              href={`/projects/${projectId}`}
              variant="contained"
              sx={{ mt: 2, backgroundColor: '#191970' }}
            >
              Back to Project
            </Button>
          </Paper>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ overflowY: 'hidden', height: '100vh' }}>
        <Navigation />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Typography variant="h6">Project not found</Typography>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="h-screen overflow-y-hidden">
      <Navigation />
      <div className="max-w-2xl mx-auto p-5">
        <div className="flex items-center mb-5 gap-5">
          <Link 
            href={`/projects/${projectId}`}
            className="no-underline text-[#191970] text-2xl"
          >
            <ArrowBackIcon fontSize="inherit" />
          </Link>
          <h1 className="m-0">Project Settings</h1>
        </div>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Project Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Project Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {project.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Created On
              </Typography>
              <Typography variant="body1">
                {formattedDate}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Owner
              </Typography>
              <Typography variant="body1">
                {project.ownerUsername}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, border: '1px solid #dc3545' }}>
          <Typography variant="h6" component="h2" gutterBottom color="error">
            Danger Zone
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Deleting a project is permanent and cannot be undone. All stories, members, and data associated with this project will be lost.
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setShowDeleteDialog(true)}
            sx={{ mt: 2 }}
          >
            Delete Project
          </Button>
        </Paper>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => { setShowDeleteDialog(false); setDeleteConfirmText(''); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#dc3545' }}>
          Delete Project
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            This action cannot be undone. To confirm, type <strong>{project.name}</strong> below:
          </Typography>
          <TextField
            fullWidth
            label="Type project name to confirm"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            sx={{ mt: 2 }}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText(''); }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProject}
            disabled={deleteConfirmText !== project.name || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
