'use client';

import { useCallback, useEffect, useState } from 'react';

export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export function useOtpResend(initialCooldown = OTP_RESEND_COOLDOWN_SECONDS) {
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const startCooldown = useCallback(
    (seconds: number = initialCooldown) => {
      setCountdown(seconds);
      setCanResend(false);
    },
    [initialCooldown]
  );

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return { countdown, canResend, startCooldown, formatTime };
}
