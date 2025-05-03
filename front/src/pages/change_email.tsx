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
  CircularProgress
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import logo from '../icons/logo.png';
import { userAPI } from '../api/apiClient';

const ChangeEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVerificationStage, setIsVerificationStage] = useState(false);

  const isEmailValid = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ru|com|net|org|io|dev)$/.test(value);

  const handleChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'verificationCode') setVerificationCode(value);
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
      if (!isVerificationStage) {
        if (!email) throw new Error('Введите email.');
        if (!isEmailValid(email)) throw new Error('Неверный формат email.');
        await userAPI.updateEmail(email);
        setIsVerificationStage(true);
      } else {
        if (!verificationCode) throw new Error('Введите код подтверждения.');
        await userAPI.validateEmailToken(email, verificationCode);
        setSuccess(true);
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrors({ [isVerificationStage ? 'verificationCode' : 'email']: error.response.data.message });
      } else {
        setErrors({ [isVerificationStage ? 'verificationCode' : 'email']: error.message });
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
          Смена email
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
          {!isVerificationStage ? (
            <FormControl variant="outlined" fullWidth error={!!errors.email}>
              <FormLabel sx={commonLabelStyle}>Новый email</FormLabel>
              <OutlinedInput
                type="email"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                sx={commonInputStyle}
              />
              {errors.email && <FormHelperText sx={errorTextStyle}>{errors.email}</FormHelperText>}
            </FormControl>
          ) : (
            <>
              <Typography sx={{ textAlign: 'center', mb: 2 }}>
                На ваш email {email} был отправлен код подтверждения
              </Typography>
              <FormControl variant="outlined" fullWidth error={!!errors.verificationCode}>
                <FormLabel sx={commonLabelStyle}>Код подтверждения</FormLabel>
                <OutlinedInput
                  type="text"
                  value={verificationCode}
                  onChange={(e) => handleChange('verificationCode', e.target.value)}
                  sx={commonInputStyle}
                />
                {errors.verificationCode && <FormHelperText sx={errorTextStyle}>{errors.verificationCode}</FormHelperText>}
              </FormControl>
            </>
          )}

          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || (!isVerificationStage ? !email : !verificationCode)}
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
            ) : isVerificationStage ? (
              'Подтвердить'
            ) : (
              'Сменить email'
            )}
          </Button>
        </Box>
      </Box>

      <Snackbar open={success} autoHideDuration={4000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          Email успешно изменён
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChangeEmailPage; 