import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Link,
  OutlinedInput,
  FormControl,
  FormLabel,
  FormHelperText,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircleOutline } from '@mui/icons-material';

const mockUsers = [
  { email: 'test@example.com', password: 'Password123' },
  { email: 'user@domain.ru', password: 'Password123' },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmailValid = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ru|com|net|org|io|dev)$/.test(value);

  const isPasswordValid = (value: string) => {
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return value.length >= 6 && hasLowerCase && hasUpperCase && hasNumber;
  };

  const isFormValid = () => {
    return email.trim() && password.trim() && Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
    setSuccess(false);
  };

  const handleLogin = () => {
    setErrors({});
    setLoading(true);

    setTimeout(() => {
      const newErrors: { [key: string]: string } = {};
      if (!email) newErrors.email = 'Введите email.';
      else if (!isEmailValid(email)) newErrors.email = 'Неверный формат email.';
      if (!password) newErrors.password = 'Введите пароль.';
      else if (!isPasswordValid(password)) newErrors.password = 'Пароль должен содержать минимум 6 символов, включая заглавные и строчные буквы, а также цифры.';

      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (!user && Object.keys(newErrors).length === 0) {
        newErrors.password = 'Неверный email или пароль.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/profile'), 2000);
      }
      setLoading(false);
    }, 400);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleCloseSuccess = () => setSuccess(false);

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
      height: '5.8vh'
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
        <Typography
          sx={{
            fontSize: { xs: '4vh', sm: '5vh', md: '6vh' },
            fontWeight: 600,
            marginBottom: 4,
            textAlign: 'center',
            color: '#F6F7FF',
			letterSpacing: '0.04em'
          }}
        >
          Добро пожаловать
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
          <FormControl variant="outlined" fullWidth error={!!errors.email}>
            <FormLabel sx={commonLabelStyle}>Email</FormLabel>
            <OutlinedInput
              type="email"
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              sx={commonInputStyle}
            />
            {errors.email && <FormHelperText sx={errorTextStyle}>{errors.email}</FormHelperText>}
          </FormControl>

          <FormControl variant="outlined" fullWidth error={!!errors.password}>
            <FormLabel sx={commonLabelStyle}>Пароль</FormLabel>
            <OutlinedInput
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              sx={commonInputStyle}
            />
            {errors.password && <FormHelperText sx={errorTextStyle}>{errors.password}</FormHelperText>}
          </FormControl>

          <Box sx={{ textAlign: 'right', mt: -2, mb: 1 }}>
            <Link
              onClick={() => navigate('/reset_passw')}
              underline="none"
              sx={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: '1.8vh', color: '#F6F7FF', cursor: 'pointer' }}
            >
              Забыли пароль?
            </Link>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              disabled={!isFormValid() || loading}
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
              {loading ? <CircularProgress size={24} sx={{ color: '#F6F7FF' }} /> : success ? 'Успешно!' : 'Войти'}
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: '#585C87',
                color: '#F6F7FF',
                fontFamily: 'Raleway',
                fontWeight: 600,
                fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' },
                height: '6.5vh',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#4a4d75' }
              }}
            >
              Создать аккаунт
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar open={success} autoHideDuration={4000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          Успешный вход
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginPage;