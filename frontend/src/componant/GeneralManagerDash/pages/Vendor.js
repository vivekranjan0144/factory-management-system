import { useState, useEffect } from 'react';
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
  Avatar,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Alert,
  Snackbar,
  TablePagination,
  InputAdornment,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';
import Sidebar from '../../Sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Vendors = () => {

       const {id}=useParams()
        const auth = useSelector((state) => state.auth);
  
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    vendor_id: '',
    name: '',
    contact_info: '',
    gst_number: '',
    registration_date: '',
    rating: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // API Functions
 
const fetchVendors = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await axiosInstance.get(
      'https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/vendor',
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // axios uses CORS by default, no need to specify mode
      }
    );

    const data = response.data;

    let vendorsList = [];
    if (Array.isArray(data)) {
      vendorsList = data;
    } else if (data.vendors || data.data || data.result) {
      vendorsList = data.vendors || data.data || data.result;
    }

    setVendors(vendorsList);
    setFilteredVendors(vendorsList);
  } catch (err) {
    // Axios errors can have response, else fallback to message
    const message =
      err.response && err.response.data
        ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
        : err.message;

    setError(message);
    setSnackbar({
      open: true,
      message: `Failed to fetch vendors: ${message}`,
      severity: 'error',
    });
  } finally {
    setLoading(false);
  }
};


const createVendor = async (vendorData) => {
  try {
    setSubmitting(true);

    const validation = validateForm(vendorData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      throw new Error('Please fix the validation errors');
    }

    const requestBody = {
      vendor_id: parseInt(vendorData.vendor_id),
      name: vendorData.name.trim(),
      contact_info: vendorData.contact_info.trim(),
      gst_number: vendorData.gst_number.trim(),
      registration_date: vendorData.registration_date,
      rating: parseFloat(vendorData.rating) || 0,
    };

    const response = await axiosInstance.post(
      'https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/vendor',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    // axios resolves only for status codes in 2xx, no need to check response.ok

    await fetchVendors();

    setSnackbar({
      open: true,
      message: `${vendorData.name} added successfully!`,
      severity: 'success',
    });

    return true;
  } catch (err) {
    // Extract error message from axios error object
    const message =
      err.response && err.response.data
        ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
        : err.message;

    setSnackbar({
      open: true,
      message: `Failed to create vendor: ${message}`,
      severity: 'error',
    });

    return false;
  } finally {
    setSubmitting(false);
  }
};


const updateVendor = async (vendorId, vendorData) => {
  try {
    setSubmitting(true);

    const validation = validateForm(vendorData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      throw new Error('Please fix the validation errors');
    }

    const requestBody = {
      vendor_id: parseInt(vendorData.vendor_id),
      name: vendorData.name.trim(),
      contact_info: vendorData.contact_info.trim(),
      gst_number: vendorData.gst_number.trim(),
      registration_date: vendorData.registration_date,
      rating: parseFloat(vendorData.rating) || 0,
    };

    await axiosInstance.patch(
      `https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/vendor/${vendorId}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    await fetchVendors();
    setSnackbar({
      open: true,
      message: `${vendorData.name} updated successfully!`,
      severity: 'success',
    });

    return true;
  } catch (err) {
    const message =
      err.response && err.response.data
        ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
        : err.message;

    setSnackbar({
      open: true,
      message: `Failed to update vendor: ${message}`,
      severity: 'error',
    });

    return false;
  } finally {
    setSubmitting(false);
  }
};

const deleteVendor = async (vendorId, vendorName) => {
  try {
    await axiosInstance.delete(
      `https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/manager/vendor/${vendorId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    await fetchVendors();
    setSnackbar({
      open: true,
      message: `${vendorName} deleted successfully!`,
      severity: 'success',
    });

    return true;
  } catch (err) {
    const message =
      err.response && err.response.data
        ? `HTTP error! status: ${err.response.status} - ${JSON.stringify(err.response.data)}`
        : err.message;

    setSnackbar({
      open: true,
      message: `Failed to delete vendor: ${message}`,
      severity: 'error',
    });

    return false;
  }
};


  // Validation function
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.vendor_id) errors.vendor_id = 'Vendor ID is required';
    if (!data.name?.trim()) errors.name = 'Vendor name is required';
    if (!data.contact_info?.trim()) errors.contact_info = 'Contact information is required';
    if (!data.gst_number?.trim()) errors.gst_number = 'GST number is required';
    if (!data.registration_date) errors.registration_date = 'Registration date is required';
    if (data.rating && (data.rating < 0 || data.rating > 5)) {
      errors.rating = 'Rating must be between 0 and 5';
    }
    
    // Check for duplicate vendor ID (if creating new vendor)
    if (!editingVendor) {
      const existingVendor = vendors.find(vendor => vendor.vendor_id === parseInt(data.vendor_id));
      if (existingVendor) errors.vendor_id = 'Vendor ID already exists';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Utility functions
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= roundedRating ? 
        <StarIcon key={i} sx={{ color: '#ffc107', fontSize: 16 }} /> : 
        <StarBorderIcon key={i} sx={{ color: '#ffc107', fontSize: 16 }} />
      );
    }
    return stars;
  };

  const parseContactInfo = (contactInfo) => {
    const emailMatch = contactInfo.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    const phoneMatch = contactInfo.match(/\+?[\d\s\-\(\)]+/);
    
    return {
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      full: contactInfo
    };
  };

  // Effects
  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    let filtered = vendors.filter(vendor =>
      vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact_info?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.gst_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendor_id?.toString().includes(searchTerm)
    );

    setFilteredVendors(filtered);
    setPage(0);
  }, [searchTerm, vendors]);

  // Event handlers
  const handleOpenDialog = (vendor = null) => {
    if (vendor) {
      setEditingVendor(vendor);
      setFormData({
        vendor_id: vendor.vendor_id || '',
        name: vendor.name || '',
        contact_info: vendor.contact_info || '',
        gst_number: vendor.gst_number || '',
        registration_date: vendor.registration_date ? vendor.registration_date.split('T')[0] : '',
        rating: vendor.rating || ''
      });
    } else {
      setEditingVendor(null);
      setFormData({
        vendor_id: '',
        name: '',
        contact_info: '',
        gst_number: '',
        registration_date: new Date().toISOString().split('T')[0],
        rating: ''
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVendor(null);
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
    
    if (editingVendor) {
      success = await updateVendor(editingVendor.vendor_id, formData);
    } else {
      success = await createVendor(formData);
    }
    
    if (success) {
      handleCloseDialog();
    }
  };

  const handleDelete = async (vendor) => {
    if (window.confirm(`Are you sure you want to delete "${vendor.name}"?`)) {
      await deleteVendor(vendor.vendor_id, vendor.name);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} sx={{ color: '#2EB62C' }} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading vendors...</Typography>
      </Box>
    );
  }

  // Error state
  if (error && vendors.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load vendors: {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchVendors}
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
          Vendor Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your suppliers and vendor relationships
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BusinessIcon sx={{ fontSize: 40, color: '#2EB62C', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {vendors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Vendors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StarIcon sx={{ fontSize: 40, color: '#ffc107', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {vendors.length > 0 ? 
                  (vendors.reduce((sum, v) => sum + (v.rating || 0), 0) / vendors.length).toFixed(1) : 
                  '0'
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search vendors..."
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
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchVendors}
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
              Add Vendor
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Vendors Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell>Vendor ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>GST Number</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVendors
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((vendor) => {
                const contactInfo = parseContactInfo(vendor.contact_info || '');
                return (
                  <TableRow key={vendor.vendor_id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2EB62C' }}>
                        {vendor.vendor_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#2EB62C' }}>
                          <BusinessIcon />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {vendor.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {contactInfo.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">{contactInfo.email}</Typography>
                          </Box>
                        )}
                        {contactInfo.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">{contactInfo.phone}</Typography>
                          </Box>
                        )}
                        {!contactInfo.email && !contactInfo.phone && (
                          <Typography variant="body2">{vendor.contact_info}</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {vendor.gst_number}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {vendor.registration_date ? 
                            new Date(vendor.registration_date).toLocaleDateString() : 
                            'N/A'
                          }
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {renderStars(vendor.rating || 0)}
                        <Typography variant="caption" color="text.secondary">
                          ({vendor.rating || 0}/5)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleOpenDialog(vendor)}
                          sx={{ color: '#2EB62C' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(vendor)}
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
          count={filteredVendors.length}
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
          {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vendor ID"
                name="vendor_id"
                type="number"
                value={formData.vendor_id}
                onChange={handleInputChange}
                required
                disabled={editingVendor ? true : false}
                error={!!formErrors.vendor_id}
                helperText={formErrors.vendor_id}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Info"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleInputChange}
                required
                multiline
                rows={2}
                error={!!formErrors.contact_info}
                helperText={formErrors.contact_info}
                placeholder="email@example.com | +91-9876543210"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GST Number"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleInputChange}
                required
                error={!!formErrors.gst_number}
                helperText={formErrors.gst_number}
                placeholder="27AAEPM1234A1Z5"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Registration Date"
                name="registration_date"
                type="date"
                value={formData.registration_date}
                onChange={handleInputChange}
                required
                error={!!formErrors.registration_date}
                helperText={formErrors.registration_date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rating"
                name="rating"
                type="number"
                step="0.1"
                inputProps={{ min: 0, max: 5 }}
                value={formData.rating}
                onChange={handleInputChange}
                error={!!formErrors.rating}
                helperText={formErrors.rating}
                placeholder="4.5"
              />
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
             (editingVendor ? 'Update Vendor' : 'Add Vendor')}
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

export default Vendors;
