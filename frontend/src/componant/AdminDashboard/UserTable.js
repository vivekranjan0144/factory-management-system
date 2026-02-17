import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Paper, Box, Tooltip, Stack, Typography, Chip
} from '@mui/material';
import { FaEdit, FaTrashAlt, FaUser } from 'react-icons/fa';
import { useMediaQuery, useTheme } from '@mui/material';

const roleColors = {
  admin: 'error',
  manager: 'primary',
  user: 'success',
};

const gradientBg = 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)';
const tableHeadGradient = 'linear-gradient(90deg, #6366f1 60%, #06b6d4 100%)';

const UserTable = ({ users, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        overflowX: 'auto',
        p: { xs: 1, sm: 2, md: 4 },
        background: gradientBg,
        borderRadius: 4,
        minHeight: '60vh',
        transition: 'box-shadow 0.4s cubic-bezier(.4,2,.6,1)',
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          background: 'linear-gradient(120deg, #f1f5f9 60%, #e0e7ff 100%)',
          borderRadius: 4,
          transition: 'box-shadow 0.4s cubic-bezier(.4,2,.6,1)',
        }}
      >
        <Table
          sx={{
            minWidth: isMobile ? 320 : isTablet ? 600 : 900,
            transition: 'min-width 0.4s',
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                background: tableHeadGradient,
                transition: 'background 0.4s',
              }}
            >
              {!isMobile && (
                <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                  User ID
                </TableCell>
              )}
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                Employee ID
              </TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                Name
              </TableCell>
              {!isMobile && (
                <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                  Factory Location
                </TableCell>
              )}
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                Role
              </TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.user_id}
                sx={{
                  '&:hover': {
                    background: 'linear-gradient(90deg, #e0e7ff 60%, #f1f5f9 100%)',
                    transform: 'scale(1.01)',
                  },
                  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                }}
              >
                {!isMobile && (
                  <TableCell align="center">
                    <Chip
                      icon={<FaUser size={16} />}
                      label={user.user_id}
                      color="default"
                      variant="outlined"
                      sx={{
                        fontWeight: 500,
                        bgcolor: '#e0e7ff',
                        color: '#6366f1',
                        borderColor: '#6366f1',
                        fontSize: 13,
                      }}
                    />
                  </TableCell>
                )}
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#0ea5e9',
                      fontSize: isMobile ? 13 : 15,
                      letterSpacing: 0.5,
                    }}
                  >
                    {user.employee_id}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: '#334155',
                      fontSize: isMobile ? 14 : 16,
                    }}
                  >
                    {user.name}
                  </Typography>
                </TableCell>
                {!isMobile && (
                  <TableCell align="center">
                    <Chip
                      label={user.factory_id}
                      color="info"
                      variant="filled"
                      size="small"
                      sx={{
                        fontWeight: 600,
                        bgcolor: '#bae6fd',
                        color: '#0369a1',
                        fontSize: 13,
                      }}
                    />
                  </TableCell>
                )}
                <TableCell align="center">
                  <Chip
                    label={user.role}
                    color={roleColors[user.role] || 'default'}
                    sx={{
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      letterSpacing: 0.5,
                      fontSize: 13,
                      bgcolor:
                        user.role === 'admin'
                          ? '#fee2e2'
                          : user.role === 'manager'
                          ? '#dbeafe'
                          : '#dcfce7',
                      color:
                        user.role === 'admin'
                          ? '#b91c1c'
                          : user.role === 'manager'
                          ? '#1e40af'
                          : '#166534',
                      border: 'none',
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Edit User" arrow>
                      <Button
                        onClick={() => onEdit(user)}
                        startIcon={<FaEdit />}
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{
                          background: 'linear-gradient(90deg, #06b6d4 60%, #6366f1 100%)',
                          color: 'white',
                          minWidth: 0,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          px: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(90deg, #6366f1 60%, #06b6d4 100%)',
                          },
                          transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                        }}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                    {user.role !== 'admin' && (
                      <Tooltip title="Delete User" arrow>
                        <Button
                          onClick={() => onDelete(user.user_id)}
                          startIcon={<FaTrashAlt />}
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{
                            background: 'linear-gradient(90deg, #f43f5e 60%, #fbbf24 100%)',
                            color: 'white',
                            minWidth: 0,
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            px: 1.5,
                            '&:hover': {
                              background: 'linear-gradient(90deg, #fbbf24 60%, #f43f5e 100%)',
                            },
                            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                          }}
                        >
                          Delete
                        </Button>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserTable;
