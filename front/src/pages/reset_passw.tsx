import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, OutlinedInput, FormControl, FormLabel,
  IconButton, InputAdornment, FormHelperText, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircleOutline } from '@mui/icons-material';
import { authAPI } from '../api/apiClient';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [form, setForm] = useState({ email: '', code: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmailValid = (value: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ru|com|net|org|io|dev)$/.test(value);
  const isCodeValid = (value: string) => /^\d{6}$/.test(value);

  const isPasswordValid = (value: string) => {
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    return value.length >= 6 && hasLowerCase && hasUpperCase && hasNumber;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
    setSuccess(false);
  };

  const handleNextStep = async () => {
    setErrors({});
    setLoading(true);

    try {
      if (step === 'email') {
        if (!form.email) throw new Error('Введите email.');
        if (!isEmailValid(form.email)) throw new Error('Неверный формат email.');
        await authAPI.forgotPassword(form.email);
        setStep('code');
      } else if (step === 'code') {
        if (!form.code) throw new Error('Введите код из письма.');
        if (!isCodeValid(form.code)) throw new Error('Код должен содержать 6 цифр.');
        await authAPI.validateToken(form.email, form.code);
        setStep('password');
      } else if (step === 'password') {
        if (!form.newPassword || !form.confirmPassword) throw new Error('Введите и подтвердите пароль.');
        if (!isPasswordValid(form.newPassword)) throw new Error('Пароль должен содержать минимум 6 символов, включая заглавные и строчные буквы, а также цифры.');
        if (form.newPassword !== form.confirmPassword) throw new Error('Пароли не совпадают.');
        await authAPI.resetPassword(form.email, form.newPassword);
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrors({ [step]: error.response.data.message });
      } else {
        setErrors({ [step]: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleCloseSuccess = () => setSuccess(false);

  const commonLabelStyle = {
    color: '#F6F7FF', fontFamily: 'Raleway', fontWeight: 'bold', fontSize: '1.6vh', marginBottom: '4px',
    '&.Mui-focused': { color: '#F6F7FF' }
  };
  const commonInputStyle = {
    color: '#000000', fontFamily: 'Raleway', fontWeight: 'normal', fontSize: '2vh', backgroundColor: '#FFFFFF', borderRadius: '12px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' }, '&.Mui-focused': { color: '#000000' },
    '@media (min-width:900px) and (max-width:1025px)': { fontSize: '1.7vh', height: '5.8vh' }
  };
  const errorTextStyle = { color: '#B00020', fontWeight: 500 };

  const isStepValid = () => {
    if (step === 'email') return !!form.email && !errors.email;
    if (step === 'code') return !!form.code && !errors.code;
    if (step === 'password') return !!form.newPassword && !!form.confirmPassword && Object.keys(errors).length === 0;
    return false;
  };

  return (
    <>
      <Box sx={{ width: '100vw', minHeight: '100vh', backgroundColor: '#585C87', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: '"Lettersano Full", sans-serif', color: '#F6F7FF', padding: 0 }}>
        <Typography sx={{ 
          fontSize: { xs: '4vh', sm: '5vh', md: '6vh' }, 
          fontWeight: 600, 
          marginBottom: 4, 
          textAlign: 'center', 
          color: '#F6F7FF',
          letterSpacing: '0.04em',
          fontFamily: '"Lettersano Full", sans-serif'
        }}>
          Восстановление пароля
        </Typography>
        <Box sx={{ width: '90%', maxWidth: 500, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {step === 'email' && (
            <FormControl variant="outlined" fullWidth error={!!errors.email}>
              <FormLabel sx={commonLabelStyle}>Email</FormLabel>
              <OutlinedInput type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} sx={commonInputStyle} />
              {errors.email && <FormHelperText sx={errorTextStyle}>{errors.email}</FormHelperText>}
            </FormControl>
          )}
          {step === 'code' && (
            <FormControl variant="outlined" fullWidth error={!!errors.code}>
              <FormLabel sx={commonLabelStyle}>Введите код из письма</FormLabel>
              <OutlinedInput type="text" value={form.code} onChange={(e) => handleChange('code', e.target.value)} sx={commonInputStyle} />
              {errors.code && <FormHelperText sx={errorTextStyle}>{errors.code}</FormHelperText>}
            </FormControl>
          )}
          {step === 'password' && (
            <>
              <FormControl variant="outlined" fullWidth error={!!errors.newPassword}>
                <FormLabel sx={commonLabelStyle}>Новый пароль</FormLabel>
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  placeholder="Минимум 6 символов, включая заглавные и строчные буквы, цифры"
                  endAdornment={<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>}
                  sx={commonInputStyle}
                />
                {errors.newPassword && <FormHelperText sx={errorTextStyle}>{errors.newPassword}</FormHelperText>}
              </FormControl>
              <FormControl variant="outlined" fullWidth error={!!errors.confirmPassword}>
                <FormLabel sx={commonLabelStyle}>Подтвердите пароль</FormLabel>
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Повторите новый пароль"
                  endAdornment={<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>}
                  sx={commonInputStyle}
                />
                {errors.confirmPassword && <FormHelperText sx={errorTextStyle}>{errors.confirmPassword}</FormHelperText>}
              </FormControl>
            </>
          )}
          <Button
            onClick={handleNextStep}
            variant="contained"
            disabled={!isStepValid() || loading}
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
            {loading ? <CircularProgress size={24} sx={{ color: '#F6F7FF' }} /> :
              step === 'email' ? 'Получить код' :
              step === 'code' ? 'Подтвердить код' :
              success ? 'Успешно!' : 'Сменить пароль'}
          </Button>
        </Box>
      </Box>
      <Snackbar open={success} autoHideDuration={4000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">Пароль успешно изменён</Alert>
      </Snackbar>
    </>
  );
};

export default ResetPasswordPage;