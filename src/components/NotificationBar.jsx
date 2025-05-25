import React, { useEffect } from 'react';
import './NotificationBar.css';

const NotificationBar = ({ show, message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    let audio;

    if (show) {
      if (type === 'success') {
        audio = new Audio('/success.mp3'); // Akses file di folder public
        audio.play();
      }

      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    }
  }, [show, type, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`notification-bar ${type}`}>
      <span>{message}</span>
    </div>
  );
};

export default NotificationBar;
