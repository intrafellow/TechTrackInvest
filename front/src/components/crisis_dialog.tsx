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
            <Tooltip
              key={solution.id}
              title={
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {solution.description}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Влияние:
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Цена: {solution.effect.priceDelta > 0 ? '+' : ''}{solution.effect.priceDelta}%
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Расходы: {solution.effect.expensesDelta > 0 ? '+' : ''}{solution.effect.expensesDelta}%
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Команда: {solution.effect.teamDelta > 0 ? '+' : ''}{solution.effect.teamDelta}%
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Продукт: {solution.effect.productDelta > 0 ? '+' : ''}{solution.effect.productDelta}%
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Репутация: {solution.effect.reputationDelta > 0 ? '+' : ''}{solution.effect.reputationDelta}%
                  </Typography>
                </Box>
              }
              placement="right"
              arrow
            >
              <Button
                variant="contained"
                onClick={() => onSolutionSelect(solution.id)}
                onMouseEnter={() => setHoveredSolution(solution.id)}
                onMouseLeave={() => setHoveredSolution(null)}
                sx={{
                  width: '100%',
                  backgroundColor: hoveredSolution === solution.id ? '#D0BCFF' : '#EADDFF',
                  color: '#4A4459',
                  fontFamily: 'Raleway',
                  fontWeight: 500,
                  fontSize: '16px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: '#D0BCFF'
                  }
                }}
              >
                {solution.title}
              </Button>
            </Tooltip>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CrisisDialog; 