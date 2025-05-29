import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    ym?: (...args: any[]) => void;
  }
}

interface RouteChangeTrackerProps {
  ymId: number;
}

const RouteChangeTracker: React.FC<RouteChangeTrackerProps> = ({ ymId }) => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.ym === 'function') {
      window.ym(ymId, 'hit', location.pathname + location.search);
    }
  }, [location, ymId]);

  return null;
};

export default RouteChangeTracker; 