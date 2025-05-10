import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, styled } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface TutorialStep {
  title: string;
  description: string;
  arrowPosition: 'top' | 'right' | 'bottom' | 'left';
  targetElementId: string;
  dialogPosition?: 'bottom' | 'right' | 'left' | 'top';
}

const ArrowBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

interface TutorialDialogProps {
  onClose: () => void;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [dialogPos, setDialogPos] = useState<{top: number, left: number} | null>(null);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    // Для первого и последнего шага — центрируем
    if (currentStep === 0 || currentStep === tutorialSteps.length - 1) {
      setDialogPos(null);
      return;
    }
    // Особое позиционирование для шага 'Основные показатели'
    const step = tutorialSteps[currentStep];
    if (step.targetElementId === 'main-stats') {
      const actionPoints = document.getElementById('action-points');
      const header = document.getElementById('main-stats')?.parentElement;
      const dialog = dialogRef.current;
      if (actionPoints && dialog) {
        const actionRect = actionPoints.getBoundingClientRect();
        let headerRect;
        if (header) {
          headerRect = header.getBoundingClientRect();
        } else {
          headerRect = { left: 0, width: window.innerWidth };
        }
        const top = window.scrollY + actionRect.top + 48;
        const left = window.scrollX + headerRect.left + (headerRect.width - dialog.getBoundingClientRect().width) / 2;
        setDialogPos({ top, left });
        return;
      }
    }
    // Особое позиционирование для шага 'Навигация'
    if (step.targetElementId === 'left-menu') {
      // Пытаемся найти кнопку "Стартапы"
      const startupsBtn = document.getElementById('startups-btn');
      const leftMenu = document.getElementById('left-menu');
      const dialog = dialogRef.current;
      if (startupsBtn && leftMenu && dialog) {
        const btnRect = startupsBtn.getBoundingClientRect();
        const menuRect = leftMenu.getBoundingClientRect();
        const dialogRect = dialog.getBoundingClientRect();
        // top — над кнопкой "Стартапы"
        let top = window.scrollY + btnRect.top - dialogRect.height - 8;
        // Если не помещается — fallback на верх меню
        if (top < 8) {
          top = window.scrollY + menuRect.top - dialogRect.height - 8;
        }
        // Если и так не помещается — прижимаем к верху
        if (top < 8) top = 8;
        let left = window.scrollX + menuRect.right + 12;
        if (left + dialogRect.width > window.innerWidth) {
          left = window.scrollX + menuRect.left - dialogRect.width - 12;
          if (left < 0) {
            left = window.scrollX + menuRect.right + 12;
          }
        }
        if (left < 8) left = 8;
        if (left + dialogRect.width > window.innerWidth - 8) left = window.innerWidth - dialogRect.width - 8;
        if (top + dialogRect.height > window.innerHeight - 8) top = window.innerHeight - dialogRect.height - 8;
        setDialogPos({ top, left });
        return;
      } else if (leftMenu && dialog) {
        // Если кнопка не найдена — позиционируем над верхом меню
        const menuRect = leftMenu.getBoundingClientRect();
        const dialogRect = dialog.getBoundingClientRect();
        let top = window.scrollY + menuRect.top - dialogRect.height - 8;
        if (top < 8) top = 8;
        let left = window.scrollX + menuRect.right + 12;
        if (left + dialogRect.width > window.innerWidth) {
          left = window.scrollX + menuRect.left - dialogRect.width - 12;
          if (left < 0) {
            left = window.scrollX + menuRect.right + 12;
          }
        }
        if (left < 8) left = 8;
        if (left + dialogRect.width > window.innerWidth - 8) left = window.innerWidth - dialogRect.width - 8;
        if (top + dialogRect.height > window.innerHeight - 8) top = window.innerHeight - dialogRect.height - 8;
        setDialogPos({ top, left });
        return;
      }
    }
    // Для остальных — позиционируем относительно нужного компонента
    const targetElement = document.getElementById(step.targetElementId);
    if (targetElement && dialogRef.current) {
      const targetRect = targetElement.getBoundingClientRect();
      const dialogRect = dialogRef.current.getBoundingClientRect();
      let top = 0, left = 0;
      const margin = 12;
      // Выбор позиции
      switch (step.dialogPosition) {
        case 'bottom':
          top = window.scrollY + targetRect.bottom + margin;
          left = window.scrollX + targetRect.left + (targetRect.width - dialogRect.width) / 2;
          break;
        case 'top':
          top = window.scrollY + targetRect.top - dialogRect.height - margin;
          left = window.scrollX + targetRect.left + (targetRect.width - dialogRect.width) / 2;
          break;
        case 'right':
          top = window.scrollY + targetRect.top + (targetRect.height - dialogRect.height) / 2;
          left = window.scrollX + targetRect.right + margin;
          // Если не помещается справа — ставим слева
          if (left + dialogRect.width > window.innerWidth) {
            left = window.scrollX + targetRect.left - dialogRect.width - margin;
            // Если и слева не помещается — ставим снизу
            if (left < 0) {
              left = window.scrollX + targetRect.left + (targetRect.width - dialogRect.width) / 2;
              top = window.scrollY + targetRect.bottom + margin;
            }
          }
          break;
        case 'left':
          top = window.scrollY + targetRect.top + (targetRect.height - dialogRect.height) / 2;
          left = window.scrollX + targetRect.left - dialogRect.width - margin;
          // Если не помещается слева — ставим справа
          if (left < 0) {
            left = window.scrollX + targetRect.right + margin;
            if (left + dialogRect.width > window.innerWidth) {
              left = window.scrollX + targetRect.left + (targetRect.width - dialogRect.width) / 2;
              top = window.scrollY + targetRect.bottom + margin;
            }
          }
          break;
        default:
          // fallback — снизу
          top = window.scrollY + targetRect.bottom + margin;
          left = window.scrollX + targetRect.left + (targetRect.width - dialogRect.width) / 2;
      }
      // Корректировка, чтобы не выходило за экран
      if (left < 8) left = 8;
      if (left + dialogRect.width > window.innerWidth - 8) left = window.innerWidth - dialogRect.width - 8;
      if (top < 8) top = 8;
      if (top + dialogRect.height > window.innerHeight - 8) top = window.innerHeight - dialogRect.height - 8;
      setDialogPos({ top, left });
    } else {
      setDialogPos(null); // fallback на центр
    }
  }, [currentStep, isVisible]);

  const tutorialSteps: TutorialStep[] = [
    {
      title: 'Добро пожаловать!',
      description: 'Добро пожаловать в игру! Давайте познакомимся с основными элементами интерфейса.',
      arrowPosition: 'top',
      targetElementId: 'welcome',
      dialogPosition: undefined,
    },
    {
      title: 'Очки действий',
      description: 'Это ваши очки действий. Они показывают, сколько действий вы можете совершить в свой ход. Каждое действие тратит определенное количество очков.',
      arrowPosition: 'top',
      targetElementId: 'action-points',
      dialogPosition: 'bottom',
    },
    {
      title: 'Основные показатели',
      description: 'Здесь отображаются ваши основные показатели: Экспертиза, Финансы и Репутация. Нажмите на любой из них, чтобы увидеть подробную статистику.',
      arrowPosition: 'top',
      targetElementId: 'main-stats',
      dialogPosition: 'bottom',
    },
    {
      title: 'Календарь',
      description: 'Здесь отображается текущий месяц игры. Каждый месяц у вас есть определенное количество ходов.',
      arrowPosition: 'right',
      targetElementId: 'calendar',
      dialogPosition: 'bottom',
    },
    {
      title: 'Профиль',
      description: 'Ваш профиль игрока. Здесь вы можете увидеть свой аватар и получить доступ к личным настройкам.',
      arrowPosition: 'right',
      targetElementId: 'profile',
      dialogPosition: 'bottom',
    },
    {
      title: 'Навигация',
      description: 'Слева находится меню навигации. Здесь вы можете переключаться между стартапами и мероприятиями.',
      arrowPosition: 'left',
      targetElementId: 'left-menu',
      dialogPosition: 'right',
    },
    {
      title: 'Завершение хода',
      description: 'Когда вы закончите все действия, нажмите кнопку "Завершить ход" в нижней части левого меню.',
      arrowPosition: 'left',
      targetElementId: 'end-turn',
      dialogPosition: 'right',
    },
    {
      title: 'Готово!',
      description: 'Теперь вы готовы начать игру! Удачи!',
      arrowPosition: 'top',
      targetElementId: 'welcome',
      dialogPosition: undefined,
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsVisible(false);
    onClose();
  };

  // Получить координаты центра элемента
  const getElementCenter = (element: HTMLElement | null) => {
    if (!element) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  // Получить ближайшую точку на границе диалога к целевому элементу
  const getDialogEdgePoint = (dialogRect: DOMRect, targetCenter: { x: number, y: number }) => {
    // Центр диалога
    const cx = dialogRect.left + dialogRect.width / 2;
    const cy = dialogRect.top + dialogRect.height / 2;
    // Вектор к цели
    const dx = targetCenter.x - cx;
    const dy = targetCenter.y - cy;
    // Если цель совпадает с центром — вернуть центр
    if (dx === 0 && dy === 0) return { x: cx, y: cy };
    // Нормализуем
    const angle = Math.atan2(dy, dx);
    // Полуразмеры
    const hw = dialogRect.width / 2;
    const hh = dialogRect.height / 2;
    // Находим пересечение с краем прямоугольника
    const tanTheta = Math.abs(Math.tan(angle));
    let ex = cx, ey = cy;
    if (tanTheta <= hh / hw) {
      // Пересекает боковую грань
      ex = cx + Math.sign(dx) * hw;
      ey = cy + Math.sign(dx) * hw * Math.tan(angle);
    } else {
      // Пересекает верх/низ
      ex = cx + Math.sign(dy) * hh / Math.tan(angle);
      ey = cy + Math.sign(dy) * hh;
    }
    return { x: ex, y: ey };
  };

  // Рендер SVG-стрелки
  const renderArrow = () => {
    const targetElement = document.getElementById(tutorialSteps[currentStep].targetElementId);
    if (!targetElement || !isVisible) return null;
    const dialogRect = dialogRef.current?.getBoundingClientRect();
    if (!dialogRect) return null;
    const targetCenter = getElementCenter(targetElement);
    const start = getDialogEdgePoint(dialogRect, targetCenter);
    const end = targetCenter;
    // Если точки совпадают — не рисуем
    if (Math.abs(start.x - end.x) < 2 && Math.abs(start.y - end.y) < 2) return null;
    return (
      <svg
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 10001
        }}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
          </filter>
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="12"
            refX="6"
            refY="6"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0,0 12,6 0,12 3,6" fill="#59618C" />
          </marker>
        </defs>
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="#59618C"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
          filter="url(#shadow)"
        />
      </svg>
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999
    }}>
      <Box
        ref={dialogRef}
        sx={
          (currentStep === 0 || currentStep === tutorialSteps.length - 1 || !dialogPos)
            ? {
                position: 'relative',
                margin: 'auto',
              }
            : {
                position: 'absolute',
                top: `${dialogPos.top}px`,
                left: `${dialogPos.left}px`,
                margin: 0,
              }
        }
      >
        <Paper
          sx={{
            position: 'relative',
            padding: { xs: '1.5vh', sm: '2vh', md: '3vh' },
            maxWidth: { xs: '80vw', sm: '60vw', md: '400px' },
            width: { xs: '90vw', sm: 'auto', md: 'auto' },
            backgroundColor: '#EAEAF0',
            borderRadius: { xs: '0.8vh', sm: '1vh', md: '1.2vh' },
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontFamily: 'Lettersano Full, sans-serif',
              color: '#413545',
              fontSize: { xs: '1.8vh', sm: '2vh', md: '2.2vh' },
              textAlign: 'center'
            }}
          >
            {tutorialSteps[currentStep].title}
          </Typography>
          <Typography 
            variant="body1" 
            paragraph
            sx={{
              fontFamily: 'Raleway, sans-serif',
              color: '#413545',
              fontSize: { xs: '1.4vh', sm: '1.6vh', md: '1.8vh' },
              textAlign: 'center'
            }}
          >
            {tutorialSteps[currentStep].description}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 2,
            gap: { xs: '1vh', sm: '1.5vh', md: '2vh' }
          }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              sx={{
                fontFamily: 'Lettersano Full, sans-serif',
                fontSize: { xs: '1.2vh', sm: '1.4vh', md: '1.6vh' },
                flex: 1,
                color: '#59618C',
                borderColor: '#59618C',
                '&:hover': {
                  borderColor: '#444A6B',
                  backgroundColor: 'rgba(89, 97, 140, 0.1)'
                }
              }}
            >
              Назад
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                fontFamily: 'Lettersano Full, sans-serif',
                fontSize: { xs: '1.2vh', sm: '1.4vh', md: '1.6vh' },
                flex: 1,
                backgroundColor: '#59618C',
                '&:hover': {
                  backgroundColor: '#444A6B'
                }
              }}
            >
              {currentStep === tutorialSteps.length - 1 ? 'Завершить' : 'Далее'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TutorialDialog; 