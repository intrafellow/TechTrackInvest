import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  OutlinedInput,
  FormControl,
  FormLabel,
  FormHelperText,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircleOutline } from '@mui/icons-material';
import logo from '../icons/logo.png';
import { userAPI } from '../api/apiClient';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPasswordValid = (value: string) => {
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return value.length >= 6 && hasLowerCase && hasUpperCase && hasNumber;
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'newPassword') setNewPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
    setSuccess(false);
  };

  const handleSubmit = async () => {
    setErrors({});
    setLoading(true);

    try {
      if (!newPassword) throw new Error('Введите новый пароль.');
      if (!isPasswordValid(newPassword)) throw new Error('Пароль должен содержать минимум 6 символов, включая заглавные и строчные буквы, цифры.');
      if (newPassword !== confirmPassword) throw new Error('Пароли не совпадают.');
      
      await userAPI.updatePassword(newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrors({ password: error.response.data.message });
      } else {
        setErrors({ password: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  const commonLabelStyle = {
    color: '#F6F7FF',
    fontFamily: 'Raleway',
    fontWeight: 'bold',
    fontSize: '1.6vh',
    marginBottom: '4px',
    '&.Mui-focused': {
      color: '#F6F7FF'
    }
  };

  const commonInputStyle = {
    color: '#000000',
    fontFamily: 'Raleway',
    fontWeight: 'normal',
    fontSize: '2vh',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
    '&.Mui-focused': { color: '#000000' },
    '@media (min-width:900px) and (max-width:1025px)': {
      fontSize: '1.7vh',
      height: '5.8vh',
      '& .MuiInputBase-input::placeholder': {
        fontSize: '1.2vh'
      }
    },
    '& .MuiInputBase-input::placeholder': {
      fontSize: '1.4vh',
      opacity: 0.7,
      '@media (max-width: 600px)': {
        fontSize: '1.2vh'
      }
    }
  };

  const errorTextStyle = {
    color: '#B00020',
    fontWeight: 500
  };

  return (
    <>
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          backgroundColor: '#585C87',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          fontFamily: '"Lettersano Full", sans-serif',
          color: '#F6F7FF',
          padding: 0
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            position: 'absolute',
            top: 0,
            right: 0,
            padding: { xs: '1.5vh', sm: '2vh' }
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: { xs: '9vh', sm: '10vh', md: '10vh' },
              height: { xs: '7.5vh', sm: '8.5vh', md: '9vh' },
              objectFit: 'contain',
              transition: 'all 0.3s ease-in-out',
              '@media (min-width:768px) and (max-width:1024px)': {
                width: '8.5vh',
                height: '7.5vh',
                position: 'absolute',
                right: '2vh',
                top: '2vh'
              }
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: { xs: '4vh', sm: '5vh', md: '6vh' },
            fontWeight: 600,
            marginBottom: 4,
            textAlign: 'center',
            color: '#F6F7FF',
            letterSpacing: '0.04em',
            fontFamily: '"Lettersano Full", sans-serif'
          }}
        >
          Смена пароля
        </Typography>

        <Box
          sx={{
            width: '90%',
            maxWidth: 500,
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <FormControl variant="outlined" fullWidth error={!!errors.newPassword}>
            <FormLabel sx={commonLabelStyle}>Новый пароль</FormLabel>
            <OutlinedInput
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              placeholder="Минимум 6 символов, включая заглавные и строчные буквы, цифры"
              sx={commonInputStyle}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.newPassword && <FormHelperText sx={errorTextStyle}>{errors.newPassword}</FormHelperText>}
          </FormControl>

          <FormControl variant="outlined" fullWidth error={!!errors.confirmPassword}>
            <FormLabel sx={commonLabelStyle}>Подтвердите новый пароль</FormLabel>
            <OutlinedInput
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Повторите новый пароль"
              sx={commonInputStyle}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.confirmPassword && <FormHelperText sx={errorTextStyle}>{errors.confirmPassword}</FormHelperText>}
          </FormControl>

          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !newPassword || !confirmPassword}
            startIcon={success ? <CheckCircleOutline /> : undefined}
            sx={{
              backgroundColor: success ? '#4caf50' : '#737EB5',
              color: '#F6F7FF',
              fontFamily: 'Raleway',
              fontWeight: 600,
              fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
              height: '6.5vh',
              textTransform: 'none',
              '&:hover': { backgroundColor: success ? '#388e3c' : '#5f6999' },
              '&.Mui-disabled': { backgroundColor: '#b5b8c7', color: '#ffffffaa' }
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#F6F7FF' }} />
            ) : success ? (
              'Успешно!'
            ) : (
              'Сменить пароль'
            )}
          </Button>
        </Box>
      </Box>

      <Snackbar open={success} autoHideDuration={4000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          Пароль успешно изменён
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChangePasswordPage; 