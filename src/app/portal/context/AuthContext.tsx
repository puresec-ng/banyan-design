import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import cookie from '../../utils/cookie';
import { clearAuthSession, setAuthFlash } from '../../utils/security';

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

export function useInactivityLogout() {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !cookie().getCookie('token')) {
      return;
    }
    const logout = () => {
      clearAuthSession();
      setAuthFlash('Logged out due to inactivity.');
      window.location.replace('/portal');
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
