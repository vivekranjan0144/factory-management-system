import  { useState, useEffect } from 'react';
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
  Grid,
  Card,
  CardContent,
  Tooltip,
  Alert,
  Snackbar,
  TablePagination,
  InputAdornment,
  CircularProgress,
  Chip,
  Badge,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Factory as FactoryIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';
import Sidebar from '../../Sidebar/Sidebar';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Jobs = () => {


     const {id}=useParams()
      const auth = useSelector((state) => state.auth);

  const [jobs, setJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [jobsWithStatus, setJobsWithStatus] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeJobsCount, setActiveJobsCount] = useState(0);

  const [formData, setFormData] = useState({
    job_id: '',
    scheduled_start: '',
    scheduled_end: '',
    actual_start: '',
    actual_end: '',
    manager_id: '',
    target_id: '',
    factory_id: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Mock data for dropdowns (replace with actual API calls)
  const managers = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Mike Wilson' },
    { id: 4, name: 'Emily Davis' }
  ];

  const factories = [
    { id: 1, name: 'Naltali Factory' },
    { id: 2, name: 'Guwahati Factory' },
    { id: 3, name: 'Jorhat Factory' },
    { id: 4, name: 'Meghalaya Factory' },
    { id: 5, name: 'Biswanath Factory' }
  ];

  const targets = [
    { id: 1, name: 'Production Target A' },
    { id: 2, name: 'Quality Control B' },
    { id: 3, name: 'Maintenance Task C' },
    { id: 4, name: 'Assembly Line D' }
  ];

  // API Functionsimport axiosInstance from 'axiosInstance';

const fetchAllJobs = async () => {
  try {
    setLoading(true);
    setError(null);

    // Fetch jobs with latest status
    const statusResponse = await axiosInstance.get(
      'https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/jobs/latest-status',
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const statusData = statusResponse.data;
    let jobsList = [];
    if (Array.isArray(statusData)) {
      jobsList = statusData;
    } else if (statusData.jobs || statusData.data || statusData.result) {
      jobsList = statusData.jobs || statusData.data || statusData.result;
    }

    setJobs(jobsList);
    setJobsWithStatus(jobsList);
    setFilteredJobs(jobsList);

    // Fetch active jobs count
    const countResponse = await axiosInstance.get(
      'https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/job-batches/active/count',
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const countData = countResponse.data;
    setActiveJobsCount(countData.count || countData.activeCount || 0);

    // Fetch active jobs
    const activeResponse = await axiosInstance.get(
      'https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/job-batches/active',
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const activeData = activeResponse.data;
    let activeJobsList = [];
    if (Array.isArray(activeData)) {
      activeJobsList = activeData;
    } else if (activeData.jobs || activeData.data || activeData.result) {
      activeJobsList = activeData.jobs || activeData.data || activeData.result;
    }
    setActiveJobs(activeJobsList);
  } catch (err) {
    const message = err.response && err.response.data
      ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
      : err.message;

    setError(message);
    setSnackbar({
      open: true,
      message: `Failed to fetch jobs: ${message}`,
      severity: 'error',
    });
  } finally {
    setLoading(false);
  }
};

const createJob = async (jobData) => {
  try {
    setSubmitting(true);

    const validation = validateForm(jobData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      throw new Error('Please fix the validation errors');
    }

    const requestBody = {
      job_id: parseInt(jobData.job_id),
      scheduled_start: jobData.scheduled_start,
      scheduled_end: jobData.scheduled_end,
      actual_start: jobData.actual_start || null,
      actual_end: jobData.actual_end || null,
      manager_id: parseInt(jobData.manager_id),
      target_id: parseInt(jobData.target_id),
      factory_id: parseInt(jobData.factory_id),
    };

    const response = await axiosInstance.post(
      'https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/jobs',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('Job created:', response.data);

    await fetchAllJobs();
    setSnackbar({
      open: true,
      message: `Job ${jobData.job_id} created successfully!`,
      severity: 'success',
    });

    return true;
  } catch (err) {
    const message = err.response && err.response.data
      ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
      : err.message;

    setSnackbar({
      open: true,
      message: `Failed to create job: ${message}`,
      severity: 'error',
    });
    return false;
  } finally {
    setSubmitting(false);
  }
};

const updateJob = async (jobId, jobData) => {
  try {
    setSubmitting(true);

    const validation = validateForm(jobData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      throw new Error('Please fix the validation errors');
    }

    const requestBody = {
      job_id: parseInt(jobData.job_id),
      scheduled_start: jobData.scheduled_start,
      scheduled_end: jobData.scheduled_end,
      actual_start: jobData.actual_start || null,
      actual_end: jobData.actual_end || null,
      manager_id: parseInt(jobData.manager_id),
      target_id: parseInt(jobData.target_id),
      factory_id: parseInt(jobData.factory_id),
    };

    const response = await axiosInstance.put(
      `https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/jobs/${jobId}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('Job updated:', response.data);

    await fetchAllJobs();
    setSnackbar({
      open: true,
      message: `Job ${jobData.job_id} updated successfully!`,
      severity: 'success',
    });

    return true;
  } catch (err) {
    const message = err.response && err.response.data
      ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
      : err.message;

    setSnackbar({
      open: true,
      message: `Failed to update job: ${message}`,
      severity: 'error',
    });
    return false;
  } finally {
    setSubmitting(false);
  }
};

// const deleteJob = async (jobId) => {
//   try {
//     const response = await axiosInstance.delete(
//       `https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/jobs/${jobId}`,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//       }
//     );

//     console.log('Job deleted:', response.status);

//     await fetchAllJobs();
//     setSnackbar({
//       open: true,
//       message: `Job ${jobId} deleted successfully!`,
//       severity: 'success',
//     });

//     return true;
//   } catch (err) {
//     const message = err.response && err.response.data
//       ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
//       : err.message;

//     setSnackbar({
//       open: true,
//       message: `Failed to delete job: ${message}`,
//       severity: 'error',
//     });
//     return false;
//   }
// };

  // Validation function
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.job_id) errors.job_id = 'Job ID is required';
    if (!data.scheduled_start) errors.scheduled_start = 'Scheduled start is required';
    if (!data.scheduled_end) errors.scheduled_end = 'Scheduled end is required';
    if (!data.manager_id) errors.manager_id = 'Manager is required';
    if (!data.target_id) errors.target_id = 'Target is required';
    if (!data.factory_id) errors.factory_id = 'Factory is required';
    
    // Validate date logic
    if (data.scheduled_start && data.scheduled_end) {
      if (new Date(data.scheduled_start) >= new Date(data.scheduled_end)) {
        errors.scheduled_end = 'Scheduled end must be after scheduled start';
      }
    }
    
    if (data.actual_start && data.actual_end) {
      if (new Date(data.actual_start) >= new Date(data.actual_end)) {
        errors.actual_end = 'Actual end must be after actual start';
      }
    }
    
    // Check for duplicate job ID (if creating new job)
    if (!editingJob) {
      const existingJob = jobs.find(job => job.job_id === parseInt(data.job_id));
      if (existingJob) errors.job_id = 'Job ID already exists';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Utility functions
  const getJobStatus = (job) => {
    const now = new Date();
    const scheduledStart = new Date(job.scheduled_start);
    const scheduledEnd = new Date(job.scheduled_end);
    const actualStart = job.actual_start ? new Date(job.actual_start) : null;
    const actualEnd = job.actual_end ? new Date(job.actual_end) : null;

    if (actualEnd) {
      return { status: 'Completed', color: 'success', icon: <CheckCircleIcon /> };
    } else if (actualStart) {
      return { status: 'In Progress', color: 'primary', icon: <PlayIcon /> };
    } else if (now < scheduledStart) {
      return { status: 'Scheduled', color: 'info', icon: <ScheduleIcon /> };
    } else if (now > scheduledEnd && !actualStart) {
      return { status: 'Overdue', color: 'error', icon: <StopIcon /> };
    } else {
      return { status: 'Pending', color: 'warning', icon: <TimeIcon /> };
    }
  };

  const getManagerName = (managerId) => {
    const manager = managers.find(m => m.id === managerId);
    return manager ? manager.name : `Manager ${managerId}`;
  };

  const getFactoryName = (factoryId) => {
    const factory = factories.find(f => f.id === factoryId);
    return factory ? factory.name : `Factory ${factoryId}`;
  };

  const getTargetName = (targetId) => {
    const target = targets.find(t => t.id === targetId);
    return target ? target.name : `Target ${targetId}`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Not set';
    return new Date(dateTime).toLocaleString();
  };

  // Statistics
  const getCompletedJobsCount = () => {
    return jobs.filter(job => job.actual_end).length;
  };

  const getInProgressJobsCount = () => {
    return jobs.filter(job => job.actual_start && !job.actual_end).length;
  };

  const getOverdueJobsCount = () => {
    const now = new Date();
    return jobs.filter(job => 
      new Date(job.scheduled_end) < now && !job.actual_start
    ).length;
  };

  // Effects
  useEffect(() => {
    fetchAllJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs.filter(job =>
      job.job_id?.toString().includes(searchTerm) ||
      getManagerName(job.manager_id)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getFactoryName(job.factory_id)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTargetName(job.target_id)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter) {
      filtered = filtered.filter(job => {
        const status = getJobStatus(job).status;
        return status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    setFilteredJobs(filtered);
    setPage(0);
  }, [searchTerm, statusFilter, jobs]);

  // Event handlers
  const handleOpenDialog = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        job_id: job.job_id || '',
        scheduled_start: job.scheduled_start ? job.scheduled_start.slice(0, 16) : '',
        scheduled_end: job.scheduled_end ? job.scheduled_end.slice(0, 16) : '',
        actual_start: job.actual_start ? job.actual_start.slice(0, 16) : '',
        actual_end: job.actual_end ? job.actual_end.slice(0, 16) : '',
        manager_id: job.manager_id || '',
        target_id: job.target_id || '',
        factory_id: job.factory_id || ''
      });
    } else {
      setEditingJob(null);
      setFormData({
        job_id: '',
        scheduled_start: '',
        scheduled_end: '',
        actual_start: '',
        actual_end: '',
        manager_id: '',
        target_id: '',
        factory_id: ''
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingJob(null);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    let success = false;
    
    if (editingJob) {
      success = await updateJob(editingJob.job_id, formData);
    } else {
      success = await createJob(formData);
    }
    
    if (success) {
      handleCloseDialog();
    }
  };

  const handleDelete = async (job) => {
    if (window.confirm(`Are you sure you want to delete Job ${job.job_id}?`)) {
      await deleteJob(job.job_id);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} sx={{ color: '#2EB62C' }} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading jobs...</Typography>
      </Box>
    );
  }

  // Error state
  if (error && jobs.length === 0) {
    return (
      // <Sidebar/>
 
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load jobs: {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchAllJobs}
          startIcon={<RefreshIcon />}
          sx={{
            background: 'linear-gradient(90deg, #2EB62C 0%, #018141 100%)',
            '&:hover': { background: 'linear-gradient(90deg, #26a324 0%, #016837 100%)' }
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
          Jobs Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage production jobs, schedules, and track progress
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WorkIcon sx={{ fontSize: 40, color: '#2EB62C', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {jobs.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Badge badgeContent={activeJobsCount} color="primary">
                <PlayIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              </Badge>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {activeJobsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {getCompletedJobsCount()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Badge badgeContent={getOverdueJobsCount()} color="error">
                <StopIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
              </Badge>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {getOverdueJobsCount()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search jobs..."
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
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="in progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchAllJobs}
              sx={{ mr: 2 }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(90deg, #2EB62C 0%, #018141 100%)',
                '&:hover': { background: 'linear-gradient(90deg, #26a324 0%, #016837 100%)' }
              }}
            >
              Add Job
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Jobs Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell>Job ID</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Actual Times</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Factory</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredJobs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((job) => {
                const status = getJobStatus(job);
                return (
                  <TableRow key={job.job_id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2EB62C' }}>
                        {job.job_id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {formatDateTime(job.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Start: {formatDateTime(job.scheduled_start)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          End: {formatDateTime(job.scheduled_end)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Start: {formatDateTime(job.actual_start)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          End: {formatDateTime(job.actual_end)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {getManagerName(job.manager_id)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FactoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {getFactoryName(job.factory_id)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {getTargetName(job.target_id)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.status}
                        color={status.color}
                        size="small"
                        icon={status.icon}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleOpenDialog(job)}
                          sx={{ color: '#2EB62C' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(job)}
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredJobs.length}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingJob ? 'Edit Job' : 'Create New Job'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2EB62C' }}>
                Job Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job ID"
                name="job_id"
                type="number"
                value={formData.job_id}
                onChange={handleInputChange}
                required
                disabled={editingJob ? true : false}
                error={!!formErrors.job_id}
                helperText={formErrors.job_id}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!formErrors.factory_id}>
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
                {formErrors.factory_id && <FormHelperText>{formErrors.factory_id}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Schedule Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2EB62C' }}>
                Schedule
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Scheduled Start"
                name="scheduled_start"
                type="datetime-local"
                value={formData.scheduled_start}
                onChange={handleInputChange}
                required
                error={!!formErrors.scheduled_start}
                helperText={formErrors.scheduled_start}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Scheduled End"
                name="scheduled_end"
                type="datetime-local"
                value={formData.scheduled_end}
                onChange={handleInputChange}
                required
                error={!!formErrors.scheduled_end}
                helperText={formErrors.scheduled_end}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Actual Times */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2EB62C' }}>
                Actual Times (Optional)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Actual Start"
                name="actual_start"
                type="datetime-local"
                value={formData.actual_start}
                onChange={handleInputChange}
                error={!!formErrors.actual_start}
                helperText={formErrors.actual_start}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Actual End"
                name="actual_end"
                type="datetime-local"
                value={formData.actual_end}
                onChange={handleInputChange}
                error={!!formErrors.actual_end}
                helperText={formErrors.actual_end}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Assignments */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2EB62C' }}>
                Assignments
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!formErrors.manager_id}>
                <InputLabel>Manager</InputLabel>
                <Select
                  name="manager_id"
                  value={formData.manager_id}
                  label="Manager"
                  onChange={handleInputChange}
                >
                  {managers.map(manager => (
                    <MenuItem key={manager.id} value={manager.id}>{manager.name}</MenuItem>
                  ))}
                </Select>
                {formErrors.manager_id && <FormHelperText>{formErrors.manager_id}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!formErrors.target_id}>
                <InputLabel>Target</InputLabel>
                <Select
                  name="target_id"
                  value={formData.target_id}
                  label="Target"
                  onChange={handleInputChange}
                >
                  {targets.map(target => (
                    <MenuItem key={target.id} value={target.id}>{target.name}</MenuItem>
                  ))}
                </Select>
                {formErrors.target_id && <FormHelperText>{formErrors.target_id}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{
              background: 'linear-gradient(90deg, #2EB62C 0%, #018141 100%)',
              '&:hover': { background: 'linear-gradient(90deg, #26a324 0%, #016837 100%)' }
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 
             (editingJob ? 'Update Job' : 'Create Job')}
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

export default Jobs;
