import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { Box, IconButton, Typography, Divider } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface MobileSliderProps {
  children: React.ReactNode[];
  title: string;
}

const MobileSlider: React.FC<MobileSliderProps> = ({ children, title }) => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = children.length;

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box 
      sx={{ width: '100%', position: 'relative' }}
      onClick={(e) => {
        console.log('Клик по MobileSlider');
        e.stopPropagation();
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          marginBottom: '1vh',
          color: '#E3E6FF',
          fontSize: { xs: '1.8vh', sm: '2vh' },
          textAlign: 'center'
        }}
      >
        {title}
      </Typography>
      <Divider sx={{ 
        backgroundColor: '#CAC4D0', 
        marginBottom: { xs: '4vh', sm: '2vh' }
      }} />
      
      <Box 
        sx={{ position: 'relative' }}
        onClick={(e) => {
          console.log('Клик по Box');
          e.stopPropagation();
        }}
      >
        <SwipeableViews
          axis="x"
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          style={{ padding: '0 1vh' }}
          containerStyle={{
            overflow: 'visible'
          }}
          slideStyle={{
            overflow: 'visible'
          }}
          onClick={(e) => {
            console.log('Клик по SwipeableViews');
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            console.log('TouchStart по SwipeableViews');
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            console.log('TouchEnd по SwipeableViews');
            e.stopPropagation();
          }}
        >
          {children}
        </SwipeableViews>

        <IconButton
          onClick={(e) => {
            console.log('Клик по IconButton (назад)');
            e.stopPropagation();
            handleBack();
          }}
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#E3E6FF',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
            zIndex: 2
          }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>

        <IconButton
          onClick={(e) => {
            console.log('Клик по IconButton (вперед)');
            e.stopPropagation();
            handleNext();
          }}
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#E3E6FF',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
            zIndex: 2
          }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: { xs: '4vh', sm: '1vh' }
      }}>
        {Array.from(Array(maxSteps)).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: '1vh',
              height: '1vh',
              borderRadius: '50%',
              backgroundColor: index === activeStep ? '#E3E6FF' : 'rgba(227, 230, 255, 0.3)',
              margin: '0 0.5vh',
              transition: 'background-color 0.3s ease'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MobileSlider; 