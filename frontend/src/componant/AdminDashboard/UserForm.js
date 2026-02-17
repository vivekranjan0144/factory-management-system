import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Tooltip,
  useMediaQuery,
  Slide,
  Fade,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import LockIcon from '@mui/icons-material/Lock';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserForm = ({ open, onClose, onSave, user }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [email, setEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeListFetched, setEmployeeListFetched] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setEmployeeId(user ? user.employee_id : '');
    setEmail(user ? user.email : '');
    setOriginalEmail(user ? user.email : '');
    setPassword('');
    setErrors({});
    if (user) {
      setEmployeeName(user.name);
      setEmployeeRole(user.role);
    } else {
      setEmployeeName('');
      setEmployeeRole('');
    }
  }, [user, open]);

  useEffect(() => {
    if (employeeId && !user) {
      fetchEmployeeDetails(employeeId);
    }
    // eslint-disable-next-line
  }, [employeeId, user]);

  const fetchEmployeeList = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // console.error('No auth token found');
      return;
    }

    try {
      const response = await fetch('https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/admin/emp_id', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch employee list');

      const data = await response.json();
      const list = Array.isArray(data) ? data : Object.values(data).map((id) => ({ employee_id: id }));

      setEmployeeList(list);
      setEmployeeListFetched(true);
    } catch (err) {
      // console.error('Error fetching employee IDs:', err);
      setEmployeeList([]);
      setEmployeeListFetched(false);
    }
  };

  const fetchEmployeeDetails = async (id) => {
    const token = localStorage.getItem('token');
    if (!token || !id) return;

    try {
      const response = await fetch(`https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/admin/employee/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch employee details');
      const data = await response.json();

      if (data && data[0] && data[0].name && data[0].role) {
        setEmployeeName(data[0].name);
        setEmployeeRole(data[0].role);
      } else {
        setEmployeeName('');
        setEmployeeRole('');
      }
    } catch (err) {
      // console.error('Error fetching employee details:', err);
      setEmployeeName('');
      setEmployeeRole('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!employeeId && !user) newErrors.employeeId = 'Employee ID is required';
    if (!email) newErrors.email = 'Email is required';
    if (!user && !password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSave({
      employee_id: employeeId,
      email,
      password,
      emailChanged: email !== originalEmail,
      passwordChanged: password !== '',
    });
  };

  const colors = {
    gradient: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e3f0ff 100%)',
    dialogBg: 'rgba(255,255,255,0.95)',
    accent: '#6a11cb',
    accentLight: '#b3aaff',
    button: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
    buttonText: '#fff',
    error: '#ff1744',
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 4 },
          boxShadow: 12,
          background: colors.dialogBg,
          p: { xs: 0, sm: 0 },
          m: { xs: 0, sm: 2 },
          transition: 'all 0.4s cubic-bezier(.4,2,.6,1)',
        }
      }}
      TransitionComponent={Transition}
      keepMounted
    >
      <Fade in={open}>
        <Box>
          <DialogTitle
            sx={{
              background: colors.gradient,
              color: '#fff',
              fontWeight: 'bold',
              letterSpacing: 1,
              fontSize: { xs: 18, sm: 22 },
              textAlign: 'center',
              pb: 2,
              borderTopLeftRadius: { xs: 0, sm: 16 },
              borderTopRightRadius: { xs: 0, sm: 16 },
              boxShadow: '0 4px 24px 0 rgba(106,17,203,0.12)',
              transition: 'background 0.5s',
            }}
          >
            {user ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <Divider />
          <DialogContent
            sx={{
              background: colors.background,
              p: { xs: 2, sm: 3 },
              minHeight: { xs: 'auto', sm: 350 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.5s',
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              width="100%"
              maxWidth={400}
              mx="auto"
              sx={{
                animation: open ? 'fadeInUp 0.7s cubic-bezier(.4,2,.6,1)' : 'none',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(40px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              {!user && (
                <FormControl fullWidth error={!!errors.employeeId} variant="outlined">
                  <InputLabel>
                    <BadgeIcon sx={{ mr: 1, verticalAlign: 'middle' }} fontSize="small" />
                    Employee ID
                  </InputLabel>
                  <Select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    onClick={() => {
                      if (!employeeListFetched) fetchEmployeeList();
                    }}
                    label="Employee ID"
                    sx={{
                      background: '#fff',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px 0 rgba(106,17,203,0.06)',
                      transition: 'box-shadow 0.3s',
                      '&:focus': { boxShadow: '0 4px 16px 0 rgba(106,17,203,0.12)' }
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <AssignmentIndIcon color="primary" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">
                      <em>-- Select an employee --</em>
                    </MenuItem>
                    {employeeList.map((emp) => (
                      <MenuItem key={emp.employee_id} value={emp.employee_id}>
                        {emp.employee_id}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.employeeId && (
                    <Typography color={colors.error} variant="caption" sx={{ mt: 0.5 }}>
                      {errors.employeeId}
                    </Typography>
                  )}
                </FormControl>
              )}

              <TextField
                label="Name"
                value={employeeName}
                fullWidth
                margin="dense"
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#f0f4f8', borderRadius: 8 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: colors.accent }} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <TextField
                label="Role"
                value={employeeRole}
                fullWidth
                margin="dense"
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#f0f4f8', borderRadius: 8 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: colors.accent }} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="dense"
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: colors.accent }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px 0 rgba(67,233,123,0.06)',
                  }
                }}
              />

              <TextField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="dense"
                error={!!errors.password}
                helperText={errors.password || (user ? 'Leave blank to keep current password' : '')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: colors.accent }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={showPassword ? "Hide Password" : "Show Password"}>
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((show) => !show)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px 0 rgba(56,249,215,0.06)',
                  }
                }}
              />
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions
            sx={{
              background: 'linear-gradient(90deg, #e3f2fd 0%, #f8fafc 100%)',
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 2 },
              borderBottomLeftRadius: { xs: 0, sm: 16 },
              borderBottomRightRadius: { xs: 0, sm: 16 },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              transition: 'background 0.5s',
            }}
          >
            <Button
              onClick={onClose}
              color="secondary"
              variant="outlined"
              sx={{
                borderRadius: 2,
                minWidth: 100,
                fontWeight: 600,
                borderColor: colors.accent,
                color: colors.accent,
                '&:hover': {
                  background: colors.accentLight,
                  borderColor: colors.accent,
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                borderRadius: 2,
                minWidth: 100,
                fontWeight: 600,
                background: colors.button,
                color: colors.buttonText,
                boxShadow: '0 4px 16px 0 rgba(67,233,123,0.18)',
                transition: 'background 0.3s, box-shadow 0.3s',
                '&:hover': {
                  background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                  boxShadow: '0 8px 32px 0 rgba(67,233,123,0.24)',
                }
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Fade>
    </Dialog>
  );
};

export default UserForm;
