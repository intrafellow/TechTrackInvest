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
