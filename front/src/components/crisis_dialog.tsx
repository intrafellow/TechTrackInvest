import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Divider,
  Button,
  Box
} from '@mui/material';

interface Solution {
  id: string;
  text: string;
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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
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
            <Button
              key={solution.id}
              variant="contained"
              onClick={() => onSolutionSelect(solution.id)}
              sx={{
                width: '100%',
                backgroundColor: '#EADDFF',
                color: '#4A4459',
                fontFamily: 'Raleway',
                fontWeight: 500,
                fontSize: '16px',
                padding: '12px 24px',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#D0BCFF'
                }
              }}
            >
              {solution.text}
            </Button>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CrisisDialog; 