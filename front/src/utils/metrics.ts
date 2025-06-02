export const sendYMGoal = (goal: string, retries = 3) => {
  if (typeof window.ym === 'function') {
    console.log(`YM reachGoal: ${goal}`);
    window.ym(102267648, 'reachGoal', goal);
  } else if (retries > 0) {
    setTimeout(() => sendYMGoal(goal, retries - 1), 500); 
  } else {
    console.warn('YM не загрузилась, событие не отправлено:', goal);
  }
};

// Отслеживание времени на странице
export const trackPageTime = () => {
  const startTime = Date.now();
  
  return () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // в секундах
    if (timeSpent >= 600) { // Если прошло больше 10 минут
      sendYMGoal('page_time');
    }
  };
};

// Отслеживание клика по кнопке "Заказать экспертизу"
export const trackExpertiseOrder = (action?: string) => {
  sendYMGoal(action ? `expertise_order_${action}` : 'expertise_order_click');
};

// Отслеживание посещения мероприятий
export const trackEventVisit = (eventId?: string) => {
  sendYMGoal(eventId ? `event_visit_${eventId}` : 'event_visit');
};

// Отслеживание покупки стартапов
export const trackStartupPurchase = (startupId?: string) => {
  sendYMGoal(startupId ? `startup_purchase_${startupId}` : 'startup_purchase');
};
