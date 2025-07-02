import { useEffect, useRef } from 'react';
import cookie from '../../utils/cookie';

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

export function useInactivityLogout() {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const logout = () => {
      cookie().deleteCookie('token');
      cookie().deleteCookie('userType');
      // Optionally clear other session-related cookies here
      window.location.replace('/portal/login?error=' + encodeURIComponent('Logged out due to inactivity.'));
    };

    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(logout, INACTIVITY_LIMIT);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);
} 