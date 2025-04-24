import React, { useState } from 'react';
import {
  Box, Typography, Button, IconButton, InputAdornment, OutlinedInput,
  FormControl, FormLabel, FormHelperText, Snackbar, Alert
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircleOutline } from '@mui/icons-material';

const mockRegisteredUsers = [
  { email: 'user@example.com', username: 'existinguser' },
  { email: 'test@test.com', username: 'tester' }
];

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const isEmailValid = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ru|com|net|org|io|dev)$/.test(value);

  const isFormValid = () => {
    return (
      email.trim() &&
      username.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      Object.keys(errors).length === 0
    );
  };

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'email': setEmail(value); break;
      case 'username': setUsername(value); break;
      case 'password': setPassword(value); break;
      case 'confirmPassword': setConfirmPassword(value); break;
    }
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
    setSuccess(false);
  };

  const handleRegister = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) newErrors.email = 'Введите email.';
    else if (!isEmailValid(email)) newErrors.email = 'Неверный формат email.';
    else if (mockRegisteredUsers.some((u) => u.email === email)) newErrors.email = 'Email уже зарегистрирован.';

    if (!username) newErrors.username = 'Введите логин.';
    else if (mockRegisteredUsers.some((u) => u.username === username)) newErrors.username = 'Логин уже занят.';

    if (!password) newErrors.password = 'Введите пароль.';
    else if (password.length < 6) newErrors.password = 'Пароль должен содержать не менее 6 символов.';

    if (!confirmPassword) newErrors.confirmPassword = 'Подтвердите пароль.';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setSuccess(true);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleCloseSuccess = () => setSuccess(false);

  const labelStyle = {
    color: '#F6F7FF', fontFamily: 'Raleway', fontWeight: 'bold', fontSize: '1.6vh', marginBottom: '4px'
  };

  const inputStyle = {
    color: '#000', fontFamily: 'Raleway', fontSize: '2vh', backgroundColor: '#FFF', borderRadius: '12px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
    '&.Mui-focused': { color: '#000' }
  };

  const errorStyle = { color: '#B00020', fontWeight: 500 };

  return (
    <>
      <Box sx={{ width: '100vw', minHeight: '100vh', backgroundColor: '#585C87', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: '#F6F7FF' }}>
        <Typography sx={{ fontSize: { xs: '4vh', sm: '5vh', md: '6vh' }, fontWeight: 600, mb: 4 }}>Регистрация</Typography>
        <Box sx={{ width: '90%', maxWidth: 500, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl variant="outlined" fullWidth error={!!errors.email}>
            <FormLabel sx={labelStyle}>Email</FormLabel>
            <OutlinedInput type="email" value={email} onChange={(e) => handleChange('email', e.target.value)} sx={inputStyle} />
            {errors.email && <FormHelperText sx={errorStyle}>{errors.email}</FormHelperText>}
          </FormControl>

          <FormControl variant="outlined" fullWidth error={!!errors.username}>
            <FormLabel sx={labelStyle}>Логин</FormLabel>
            <OutlinedInput type="text" value={username} onChange={(e) => handleChange('username', e.target.value)} sx={inputStyle} />
            {errors.username && <FormHelperText sx={errorStyle}>{errors.username}</FormHelperText>}
          </FormControl>

          <FormControl variant="outlined" fullWidth error={!!errors.password}>
            <FormLabel sx={labelStyle}>Пароль</FormLabel>
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
              sx={inputStyle}
            />
            {errors.password && <FormHelperText sx={errorStyle}>{errors.password}</FormHelperText>}
          </FormControl>

          <FormControl variant="outlined" fullWidth error={!!errors.confirmPassword}>
            <FormLabel sx={labelStyle}>Подтвердите пароль</FormLabel>
            <OutlinedInput
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              sx={inputStyle}
            />
            {errors.confirmPassword && <FormHelperText sx={errorStyle}>{errors.confirmPassword}</FormHelperText>}
          </FormControl>

          <Button
            onClick={handleRegister}
            variant="contained"
            fullWidth
            disabled={!isFormValid()}
            startIcon={success ? <CheckCircleOutline /> : undefined}
            sx={{ backgroundColor: success ? '#4caf50' : '#737EB5', color: '#F6F7FF', fontWeight: 600, fontSize: { xs: '1.6vh', sm: '1.8vh', md: '2vh' }, height: '6.5vh', '&:hover': { backgroundColor: success ? '#388e3c' : '#5f6999' }, '&.Mui-disabled': { backgroundColor: '#b5b8c7', color: '#ffffffaa' } }}
          >
            {success ? 'Успешно!' : 'Создать аккаунт'}
          </Button>
        </Box>
      </Box>
      <Snackbar open={success} autoHideDuration={4000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          Аккаунт успешно создан
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegisterPage;
