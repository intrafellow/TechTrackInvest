export const sendYMGoal = (type: string, value: string, retries = 3) => {
  if (typeof window.ym === 'function') {
    console.log(`YM reachGoal: ${type}`);
    window.ym(102267648, type, value);
  } else if (retries > 0) {
    setTimeout(() => sendYMGoal(type, value, retries - 1), 500); 
  } else {
    console.warn('YM не загрузилась, событие не отправлено:', type);
  }
};

// Отслеживание времени на странице
export const trackPageTime = () => {
  const startTime = Date.now();
  const pageName = window.location.pathname.replace(/^\/|\/$/g, '') || 'home';
  
  return () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // в секундах
    sendYMGoal('page_time', `${pageName}_${timeSpent}`);
  };
};

// Отслеживание клика по кнопке "Заказать экспертизу"
export const trackExpertiseOrder = (action: string = 'click') => {
  sendYMGoal('expertise_order', action);
};

// Отслеживание посещения мероприятий
export const trackEventVisit = (eventId: string) => {
  sendYMGoal('event_visit', eventId);
};

// Отслеживание покупки стартапов
export const trackStartupPurchase = (startupId: string) => {
  sendYMGoal('startup_purchase', startupId);
};
