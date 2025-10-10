import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import cookie from '../../utils/cookie';

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

export function useInactivityLogout() {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Only run inactivity logic if user is logged in
    if (typeof window === 'undefined' || !cookie().getCookie('token')) {
      return;
    }
    const logout = () => {
      cookie().deleteCookie('token');
      cookie().deleteCookie('userType');
      window.location.replace('/portal?error=' + encodeURIComponent('Logged out due to inactivity.'));
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
  }, [pathname]);
} 