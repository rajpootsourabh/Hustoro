import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  LockReset as LockResetIcon 
} from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from '../Components/SnackbarContext';
import logo from '../../assets/logo_white.png';
import signup_bg from '../../assets/signup-bg.png';
import { changeTitle } from '../../utils/changeTitle';

const ResetPassword = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    changeTitle("Reset Password");
    
    // Redirect if no token or email
    if (!token || !email) {
      showSnackbar('Invalid password reset link', 'error');
      navigate('/signin');
    }
  }, [token, email, navigate, showSnackbar]);

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/password/reset`, {
        email: decodeURIComponent(email),
        token,
        password,
        password_confirmation: confirmPassword
      });

      if (response.status === 200) {
        setSuccess(true);
        showSnackbar('Password reset successfully! Redirecting to login...', 'success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      showSnackbar(
        error?.response?.data?.message || 
        'Failed to reset password. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] flex items-center justify-center bg-contain bg-top' style={{ backgroundImage: `url(${signup_bg})` }}>
      <Paper
        elevation={3}
        style={{
          padding: '40px',
          borderRadius: '20px',
          maxWidth: '450px',
          width: '90%',
          backgroundColor: 'white'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {/* <img src={logo} alt="Logo" style={{ height: '50px', marginBottom: '20px' }} /> */}
          <Typography variant="h5" style={{ fontWeight: 600, color: '#212121', marginBottom: '10px' }}>
            {success ? 'Password Reset Successful!' : 'Reset Your Password'}
          </Typography>
          {!success && (
            <Typography style={{ color: '#666' }}>
              Enter your new password below
            </Typography>
          )}
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircleIcon 
              style={{ 
                fontSize: 40, 
                color: '#4caf50',
                marginBottom: '20px'
              }} 
            />
            <Typography style={{ marginBottom: '10px', color: '#212121', fontSize: '18px', fontWeight: 500 }}>
              Your password has been reset successfully!
            </Typography>
            <Typography style={{ color: '#666' }}>
              Redirecting you to login page...
            </Typography>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              required
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                style: { borderRadius: '10px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              required
              InputProps={{
                style: { borderRadius: '10px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              style={{
                backgroundColor: '#212121',
                color: 'white',
                padding: '12px',
                borderRadius: '10px',
                marginTop: '30px',
                textTransform: 'none',
                fontSize: '16px'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>

            <Button
              fullWidth
              onClick={() => navigate('/signin')}
              style={{
                marginTop: '15px',
                textTransform: 'none',
                color: '#666'
              }}
            >
              Back to Login
            </Button>
          </form>
        )}
      </Paper>
    </div>
  );
};

export default ResetPassword;