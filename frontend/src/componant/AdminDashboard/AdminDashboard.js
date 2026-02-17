import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import TopBar from './TopBar';
import UserTable from './UserTable';
import UserForm from './UserForm';
import {
  Container,
  Button,
  Typography,
  Paper,
  Box,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      // const token = localStorage.getItem('authToken');
      const response = await fetch('https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        toast.error('Fetched data is not an array');
        setUsers([]);
      }
    } catch (error) {
      toast.error('Error fetching users');
      console.error(error);
      setUsers([]);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      // const token = localStorage.getItem('authToken');
      const token = localStorage.getItem('token')


      if (!selectedUser) {
        const response = await fetch('https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            employee_id: userData.employee_id,
            email: userData.email,
            password: userData.password,
          }),
        });

        if (response.ok) {
          await fetchUsers();
          toast.success('User created successfully');
        } else {
          toast.error('Failed to create user');
        }
      } else {
        const updatePromises = [];

        if (userData.emailChanged) {
          updatePromises.push(
            fetch(`https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/admin/users/${selectedUser.user_id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ email: userData.email }),
            })
          );
        }

        if (userData.passwordChanged) {
          updatePromises.push(
            fetch(`https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/admin/users/${selectedUser.user_id}/password`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ new_password: userData.password }),
            })
          );
        }

        const responses = await Promise.all(updatePromises);
        const allSuccessful = responses.every((res) => res.ok);

        if (allSuccessful) {
          await fetchUsers();
          toast.success('User updated successfully');
        } else {
          toast.error('One or more updates failed');
        }
      }
    } catch (error) {
      toast.error('Error saving user');
      console.error(error);
    } finally {
      setOpenForm(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token')

      // const token = localStorage.getItem('authToken');
      const response = await fetch(`https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.user_id !== id));
        toast.success('User deleted successfully');
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Error deleting user');
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f2f6f9', minHeight: '100vh' }}>
      <Box sx={{ flex: 1, width: '100%' }}>
        {/* <TopBar /> */}
        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 2, sm: 4 },
            mb: { xs: 2, sm: 4 },
            px: { xs: 0.5, sm: 2 },
            width: '100%',
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1, sm: 3 },
              borderRadius: 3,
              backgroundColor: '#ffffff',
              boxShadow: '0px 2px 10px rgba(0,0,0,0.04)',
              width: '100%',
              overflowX: 'auto',
            }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              mb={3}
              gap={2}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{
                  color: '#1e3a8a',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  mb: { xs: 1, sm: 0 },
                }}
              >
                User Management
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddUser}
                sx={{
                  backgroundColor: '#60a5fa',
                  textTransform: 'none',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  py: { xs: 1, sm: 1.5 },
                  px: { xs: 2, sm: 3 },
                  '&:hover': {
                    backgroundColor: '#3b82f6',
                  },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Add New User
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
            </Box>
          </Paper>
        </Container>
        <UserForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSave={handleSaveUser}
          user={selectedUser}
        />
        <Toaster position="top-right" toastOptions={{ style: { fontSize: '0.9rem' } }} />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
