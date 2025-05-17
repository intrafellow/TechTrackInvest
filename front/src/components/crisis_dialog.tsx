import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Divider,
  Button,
  Box,
  Tooltip
} from '@mui/material';

interface Effect {
  priceDelta: number;
  expensesDelta: number;
  teamDelta: number;
  productDelta: number;
  reputationDelta: number;
}

interface Solution {
  id: string;
  title: string;
  description: string;
  effect: Effect;
}

interface CrisisDialogProps {
  open: boolean;
  onClose: () => void;
  onSolutionSelect: (solutionId: string) => void;
  title: string;
  description: string;
  solutions: Solution[];
}

const CrisisDialog: React.FC<CrisisDialogProps> = ({
  open,
  onClose,
  onSolutionSelect,
  title,
  description,
  solutions
}) => {
  const [hoveredSolution, setHoveredSolution] = useState<string | null>(null);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);

  const handleSolutionClick = (solutionId: string) => {
    setSelectedSolution(solutionId);
  };

  const handleConfirm = () => {
    if (selectedSolution) {
      onSolutionSelect(selectedSolution);
      setSelectedSolution(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      disableBackdropClick
      PaperProps={{
        sx: {
          backgroundColor: '#F2D9D9',
          borderRadius: '8px',
          padding: '20px'
        }
      }}
    >
      <DialogContent>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Lettersano Full',
            color: '#1D1B20',
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          Кризис: {title}
        </Typography>
        
        <Divider sx={{ marginBottom: '24px', backgroundColor: '#CAC4D0' }} />
        
        <Typography
          sx={{
            fontFamily: 'Raleway',
            fontWeight: 300,
            color: '#2C2C2C',
            marginBottom: '32px'
          }}
        >
          {description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {solutions.map((solution) => (
            <Tooltip
              key={solution.id}
              title={
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {solution.description}
                  </Typography>
                </Box>
              }
              placement="right"
              arrow
            >
              <Button
                variant="contained"
                onClick={() => handleSolutionClick(solution.id)}
                onMouseEnter={() => setHoveredSolution(solution.id)}
                onMouseLeave={() => setHoveredSolution(null)}
                sx={{
                  width: '100%',
                  backgroundColor: selectedSolution === solution.id 
                    ? '#D0BCFF' 
                    : hoveredSolution === solution.id 
                      ? '#EADDFF' 
                      : '#F2D9D9',
                  color: '#4A4459',
                  fontFamily: 'Raleway',
                  fontWeight: 500,
                  fontSize: '16px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: selectedSolution === solution.id 
                      ? '#D0BCFF' 
                      : '#EADDFF'
                  }
                }}
              >
                {solution.title}
              </Button>
            </Tooltip>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedSolution}
            sx={{
              backgroundColor: selectedSolution ? '#D0BCFF' : '#EADDFF',
              color: '#4A4459',
              fontFamily: 'Raleway',
              fontWeight: 500,
              fontSize: '16px',
              padding: '12px 24px',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: selectedSolution ? '#CAC4D0' : '#EADDFF'
              }
            }}
          >
            Подтвердить
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CrisisDialog; 