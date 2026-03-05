import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Close as CloseIcon, Email as EmailIcon } from '@mui/icons-material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import axios from 'axios';
import { useSnackbar } from './SnackbarContext';

const ForgotPasswordPopup = ({ open, onClose }) => {
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showSnackbar('Please enter your email address', 'error');
      return;
    }

    try {
      setLoading(true);

      // Determine which app is making the request
      const isAdminApp = window.location.hostname.includes('admin');

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/password/forgot`, {
        email,
        app_type: isAdminApp ? 'admin' : 'main'
      });

      if (response.status === 200) {
        setEmailSent(true);
        showSnackbar(response.data.message || 'Password reset link sent to your email!', 'success');

        // Auto close after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showSnackbar(
        error?.response?.data?.message ||
        'Failed to send reset link. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '15px',
          padding: '10px'
        }
      }}
    >
      <DialogTitle style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '10px'
      }}>
        <Typography variant="h5" style={{ fontWeight: 600, color: '#212121' }}>
          {emailSent ? 'Check Your Email' : 'Forgot Password?'}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ paddingTop: '10px' }}>
        {emailSent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <MarkEmailReadIcon
              style={{
                fontSize: 40,
                color: '#4caf50',
                marginBottom: '20px'
              }}
            />
            <Typography variant="h6" style={{ marginBottom: '10px', color: '#212121' }}>
              Reset Link Sent!
            </Typography>
            <Typography style={{ color: '#666', marginBottom: '20px' }}>
              We've sent a password reset link to <strong>{email}</strong>
            </Typography>
            <Typography style={{ color: '#999', fontSize: '14px' }}>
              Didn't receive it? Check your spam folder or{' '}
              <Button
                onClick={handleSubmit}
                style={{
                  color: '#4f46e5',
                  textTransform: 'none',
                  padding: 0,
                  minWidth: 'auto'
                }}
              >
                click here to resend
              </Button>
            </Typography>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Typography style={{ marginBottom: '20px', color: '#666' }}>
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              style={{ marginBottom: '10px' }}
              InputProps={{
                style: { borderRadius: '10px' },
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon style={{ color: '#999', fontSize: '20px' }} />
                  </InputAdornment>
                )
              }}
            />
          </form>
        )}
      </DialogContent>

      {!emailSent && (
        <DialogActions style={{ padding: '20px 24px' }}>
          <Button
            onClick={handleClose}
            style={{
              color: '#666',
              textTransform: 'none',
              padding: '8px 20px'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !email}
            style={{
              backgroundColor: '#212121',
              color: 'white',
              textTransform: 'none',
              padding: '8px 30px',
              borderRadius: '8px'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ForgotPasswordPopup;