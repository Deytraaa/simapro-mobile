import React from 'react';
import { IonToast } from '@ionic/react';
import './NotificationBar.css';

const NotificationBar = ({ show, message, type, onClose }) => {
  return (
    <IonToast
      isOpen={show}
      onDidDismiss={onClose}
      message={message}
      duration={2000}
      position="top"
      cssClass={`custom-toast ${type}`}
      style={{
        '--min-height': '50px',
        '--max-width': '90%',
        '--toast-max-width': '400px'
      }}
    />
  );
};

export default NotificationBar;
