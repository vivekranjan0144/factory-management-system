import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Alert,
  Snackbar,
  TablePagination,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Factory as FactoryIcon
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';
import Sidebar from '../../Sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Staff = () => {

       const {id}=useParams()
        const auth = useSelector((state) => state.auth);
  

  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated form data to match your backend schema
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    role: '',
    contact_number: '',
    department_id: '',
    factory_id: '',
    joining_date: ''
  });

  // These should also be fetched from your API
  const departments = [
    { id: 1, name: 'Store' },
    { id: 2, name: 'Fabrication and Grinding' },
    { id: 3, name: 'Powder Coating and Treatment Plant' },
    { id: 4, name: 'Rockwool and Foam Fitting Department' },
    { id: 5, name: 'Electrical and Panel Department' },
    { id: 6, name: 'Testing' },
    { id: 7, name: 'CNC' },
    { id: 8, name: 'Store' },
    { id: 9, name: 'Production' }
  ];

  const factories = [
    { id: 1, name: 'Naltali' },
    { id: 2, name: 'Guwahati' },
    { id: 3, name: 'Jorhat' },
    { id: 3, name: 'Meghalaya' },
    { id: 3, name: 'Biswanath' }
  ];

  // Fetch staff data from your API

const fetchStaffData = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await axiosInstance.get(
      'https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/employees',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        // axiosInstance defaults to CORS if cross-origin
      }
    );

    console.log('Response status:', response.status);
    const data = response.data;
    console.log('Fetched data:', data);

    // Handle different response structures
    let employees = [];
    if (Array.isArray(data)) {
      employees = data;
    } else if (data.employees) {
      employees = data.employees;
    } else if (data.data) {
      employees = data.data;
    }

    console.log('Processed employees:', employees);

    setStaff(employees);
    setFilteredStaff(employees);
  } catch (err) {
    console.error('Error fetching staff data:', err);
    setError(err.message);
    setSnackbar({
      open: true,
      message: `Failed to fetch staff data: ${err.message}`,
      severity: 'error',
    });
  } finally {
    setLoading(false);
  }
};

const addStaffMember = async (staffData) => {
  try {
    const requiredFields = [
      'employee_id',
      'name',
      'role',
      'contact_number',
      'department_id',
      'factory_id',
      'joining_date',
    ];
    const missingFields = requiredFields.filter((field) => !staffData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const requestBody = {
      employee_id: parseInt(staffData.employee_id),
      name: staffData.name.trim(),
      role: staffData.role.trim(),
      contact_number: staffData.contact_number.trim(),
      department_id: parseInt(staffData.department_id),
      factory_id: parseInt(staffData.factory_id),
      joining_date: staffData.joining_date,
    };

    console.log('Sending request body:', JSON.stringify(requestBody, null, 2));

    const response = await axiosInstance.post(
      'https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/employees',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('Response status:', response.status);
    console.log('New employee created:', response.data);

    await fetchStaffData();
    setSnackbar({ open: true, message: 'Staff member added successfully!', severity: 'success' });
    return true;
  } catch (err) {
    console.error('Error adding staff member:', err);
    const message =
      err.response && err.response.data
        ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
        : err.message;

    setSnackbar({
      open: true,
      message: `Failed to add staff member: ${message}`,
      severity: 'error',
    });
    return false;
  }
};

const updateStaffMember = async (id, staffData) => {
  try {
    const requestBody = {
      employee_id: parseInt(staffData.employee_id),
      name: staffData.name.trim(),
      role: staffData.role.trim(),
      contact_number: staffData.contact_number.trim(),
      department_id: parseInt(staffData.department_id),
      factory_id: parseInt(staffData.factory_id),
      joining_date: staffData.joining_date,
    };

    const response = await axiosInstance.put(
      `https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/employees/${id}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await fetchStaffData();
    setSnackbar({ open: true, message: 'Staff member updated successfully!', severity: 'success' });
    return true;
  } catch (err) {
    console.error('Error updating staff member:', err);
    const message =
      err.response && err.response.data
        ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
        : err.message;

    setSnackbar({
      open: true,
      message: `Failed to update staff member: ${message}`,
      severity: 'error',
    });
    return false;
  }
};

const deleteStaffMember = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/employees/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await fetchStaffData();
    setSnackbar({ open: true, message: 'Staff member deleted successfully!', severity: 'success' });
    return true;
  } catch (err) {
    console.error('Error deleting staff member:', err);
    const message =
      err.response && err.response.data
        ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
        : err.message;

    setSnackbar({
      open: true,
      message: `Failed to delete staff member: ${message}`,
      severity: 'error',
    });
    return false;
  }
};

  // Fetch data on component mount
  useEffect(() => {
    fetchStaffData();
  }, []);

  useEffect(() => {
    let filtered = staff.filter(member =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.contact_number?.includes(searchTerm) ||
      member.department_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (departmentFilter) {
      filtered = filtered.filter(member => member.department_name === departmentFilter);
    }

    setFilteredStaff(filtered);
    setPage(0);
  }, [searchTerm, departmentFilter, staff]);

  const handleOpenDialog = (staffMember = null) => {
    if (staffMember) {
      setEditingStaff(staffMember);
      setFormData({
        employee_id: staffMember.employee_id || '',
        name: staffMember.name || '',
        role: staffMember.role || '',
        contact_number: staffMember.contact_number || '',
        department_id: staffMember.department_id || '',
        factory_id: staffMember.factory_id || '',
        joining_date: staffMember.joining_date || ''
      });
    } else {
      setEditingStaff(null);
      setFormData({
        employee_id: '',
        name: '',
        role: '',
        contact_number: '',
        department_id: '',
        factory_id: '',
        joining_date: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStaff(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    let success = false;
    
    if (editingStaff) {
      success = await updateStaffMember(editingStaff.employee_id, formData);
    } else {
      success = await addStaffMember(formData);
    }
    
    if (success) {
      handleCloseDialog();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      await deleteStaffMember(id);
    }
  };

  const getDepartmentName = (departmentId) => {
    const dept = departments.find(d => d.id == departmentId);
    return dept ? dept.name : 'Unknown';
  };

  const getFactoryName = (factoryId) => {
    const factory = factories.find(f => f.id == factoryId);
    return factory ? factory.name : 'Unknown';
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
  };

  // Get unique department names from fetched data
  const uniqueDepartments = [...new Set(staff.map(member => member.department_name).filter(Boolean))];

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} sx={{ color: '#2EB62C' }} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading staff data...</Typography>
      </Box>
    );
  }

  // Error state
  if (error && staff.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load staff data: {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchStaffData}
          sx={{
            background: 'linear-gradient(90deg, #2EB62C 0%, #018141 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #26a324 0%, #016837 100%)',
            }
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>  
   <div className='layoutContainer'>
            <Sidebar id={id} role={auth?.user?.role} />
      
      <div className="dashboard_componant">


    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2EB62C', mb: 1 }}>
          Staff Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your team members and their information
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 40, color: '#2EB62C', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {staff.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Staff
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WorkIcon sx={{ fontSize: 40, color: '#018141', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {staff.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Staff
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FactoryIcon sx={{ fontSize: 40, color: '#2EB62C', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {[...new Set(staff.map(s => s.factory_area_name).filter(Boolean))].length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Factories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FactoryIcon sx={{ fontSize: 40, color: '#2EB62C', mb: 1 }} />

              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {uniqueDepartments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Department</InputLabel>
              <Select
                value={departmentFilter}
                label="Filter by Department"
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {uniqueDepartments.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(90deg, #2EB62C 0%, #018141 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #26a324 0%, #016837 100%)',
                }
              }}
            >
              Add Staff Member
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Staff Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell>Employee ID</TableCell>
              <TableCell>Staff Member</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Factory</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaff
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => (
                <TableRow key={member.employee_id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2EB62C' }}>
                      {member.employee_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#2EB62C' }}>
                        {getInitials(member.name)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {member.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{member.contact_number}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {member.department_name || 'No Department'}
                    </Typography>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {member.factory_area_name || 'No Factory'}
                    </Typography>
                  </TableCell>
                  <TableCell>{member.joining_date ? new Date(member.joining_date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenDialog(member)}
                        sx={{ color: '#2EB62C' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(member.employee_id)}
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStaff.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                name="employee_id"
                type="number"
                value={formData.employee_id}
                onChange={handleInputChange}
                required
                disabled={editingStaff ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department_id"
                  value={formData.department_id}
                  label="Department"
                  onChange={handleInputChange}
                >
                  {departments.map(dept => (
                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Factory</InputLabel>
                <Select
                  name="factory_id"
                  value={formData.factory_id}
                  label="Factory"
                  onChange={handleInputChange}
                >
                  {factories.map(factory => (
                    <MenuItem key={factory.id} value={factory.id}>{factory.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Joining Date"
                name="joining_date"
                type="date"
                value={formData.joining_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #2EB62C 0%, #018141 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #26a324 0%, #016837 100%)',
              }
            }}
          >
            {editingStaff ? 'Update' : 'Add'} Staff Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </div>
    </div>
    </>
  );
};

export default Staff;
