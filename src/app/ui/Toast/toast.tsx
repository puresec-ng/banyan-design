// components/Toast.tsx
import React, { useEffect } from "react";
import styles from "./Notify.module.scss";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={
        type === "error"
          ? `${styles.notify} ${styles.notify__failed} font-satoshi`
          : `${styles.notify} font-satoshi`
      }
    >
      <div className={styles.notify__message}>
        <p>{message}</p>
      </div>
      <div className={styles.notify__action}>
        <button onClick={() => {}}>Ok</button>
        <button onClick={() => {}}>Dismiss</button>
      </div>
    </div>
  );
};

export default Toast;
